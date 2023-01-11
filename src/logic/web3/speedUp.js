import {BigNumber, ethers} from 'ethers';
import {GetUncorfimedHashes} from './blockCypherWrapper';
import {timer} from '../utils.js';
import {SpeedupType} from 'logic/enums/SpeedupType';
import {GWEI_TO_WEI} from 'logic/consts';
import {TransactionTypes} from 'ethers/lib/utils';

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export async function GetPendings(privateKeys, rpc, setWallets, setPendingTable) {
    setWallets([]);
    setPendingTable([]);
    var provider = new ethers
        .providers
        .JsonRpcProvider(rpc);
    var wallets = [];
    for (let i = 0; i < privateKeys.length; i++) {
        wallets.push(new ethers.Wallet(privateKeys[i], provider));
    }
    var txs = [];
    var txs_pending = [];
    var wallets_info = [];
    for (let k = 0; k < wallets.length; k++) {
        var address = await wallets[k].getAddress();
        txs_pending.push(...(await GetUncorfimedHashes(address)));
        console.log(address);
        wallets_info.push({address: address, wallet: wallets[k]});
        await timer(3000);
    }
    txs_pending = txs_pending.filter(onlyUnique);
    console.log(txs_pending);
    for (let k = 0; k < txs_pending.length; k++) {
        var tx = await provider.getTransaction(`0x${txs_pending[k]}`);

        if (tx != null) 
            txs.push(tx);
        else {
            var r = await fetch(`https://api.blockcypher.com/v1/eth/main/txs/0x${txs_pending[k]}`);
            var json = await r.json();
            if (json) {
                await timer(1000);
                var tx = {};
                tx['from'] = `0x${json['inputs']['addresses'][0]}`;
                tx['to'] = `0x${json['outputs']['addresses'][0]}`;

                tx['value'] = BigNumber.from(json['outputs']['value']);
                tx['maxFeePerGas'] = BigNumber.from(json['gas_fee_cap']);
                tx['maxPriorityFeePerGas'] = BigNumber.from(json['gas_tip_cap']);
                tx['gasLimit'] = BigNumber.from(json['gas_limit']);
                tx['data'] = `0x${json['outputs']['script']}`;
                tx['nonce'] = json['inputs']['sequence'];
                txs.push(tx);
            }
        }
    }
    setPendingTable([...txs]);
    setWallets([...wallets_info]);
    console.log(txs);
}

export async function SpeedUp(wallets, pendingTable, setPendingTable, speedupInfo) {
    if (speedupInfo['type'] == SpeedupType.Absolute) {
        await SpeedupAbsolute(wallets, pendingTable, setPendingTable, speedupInfo['fee'], speedupInfo['priority']);
    } else {
        await SpeedupPercent(wallets, pendingTable, setPendingTable, speedupInfo['percent']);
    }
}

function DeleteExcess(tx) {
    delete tx['r'];
    delete tx['v'];
    delete tx['s'];
    delete tx['wait'];
    delete tx['hash'];
    delete tx['confirmations'];
    delete tx['accessList'];
    delete tx['blockHash'];
    delete tx['blockNumber'];
    delete tx['transactionIndex'];
    delete tx['creates'];
    delete tx['gasPrice'];
    return tx;
}

async function SpeedupAbsolute(wallets, pendingTable, setPendingTable, fee, priority) {
    for (let i = 0; i < pendingTable.length; i++) {
        pendingTable[i]['maxFeePerGas'] = BigNumber.from(fee * GWEI_TO_WEI);
        pendingTable[i]['maxPriorityFeePerGas'] = BigNumber.from(priority * GWEI_TO_WEI);
    }
    console.log(pendingTable);
    await ProcessTransactions(wallets, pendingTable, setPendingTable);
}

async function SpeedupPercent(wallets, pendingTable, setPendingTable, percent) {
    for (let i = 0; i < pendingTable.length; i++) {
        var fee = parseInt(pendingTable[i]['maxFeePerGas']);
        var priority = parseInt(pendingTable[i]['maxPriorityFeePerGas']);
        pendingTable[i]['maxFeePerGas'] = BigNumber.from(fee + (fee / 100) * percent);
        pendingTable[i]['maxPriorityFeePerGas'] = BigNumber.from(priority + (priority / 100) * percent);
    }
    console.log(pendingTable);
    await ProcessTransactions(wallets, pendingTable, setPendingTable);
}

async function ProcessTransactions(wallets, txs, setPendingTable) {
    var _pendingTable = [];
    var current_txs = [...txs];
    for (let i = 0; i < current_txs.length; i++) {
        try {
            if (!current_txs[i]['confirmations']) {
                var wallet = wallets.filter((w) => w['address'].toLowerCase() == current_txs[i]['from'].toLowerCase())[0]['wallet'];
                SendTransaction(wallet, current_txs[i], _pendingTable, setPendingTable);
                console.log('CURRENT PENDING TABLE ', _pendingTable);
                console.log('CURRENT TX ', current_txs[i]);
            }
        } catch (e) {
            console.log(e);
        }

    }
    setPendingTable([..._pendingTable]);
}

async function SendTransaction(wallet, tx, pendingTable, setPendingTable) {
    try {
        tx = DeleteExcess(tx);
        var result = await wallet.sendTransaction(tx);
        console.log('RESULT - ', result);
        pendingTable.push(result);
        console.log('SEND TABLE - ', pendingTable);
        setPendingTable([...pendingTable]);
        var receipt = await result.wait();
        result['confirmations'] = 1;
        setPendingTable([...pendingTable]);
    } catch (e) {
        console.log(e);
        return;
    }
}
