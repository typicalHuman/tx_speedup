import {ethers} from 'ethers';
import {GetUncorfimedHashes} from './blockCypherWrapper';
import {timer} from '../utils.js';
import {SpeedupType} from 'logic/enums/SpeedupType';
import {GWEI_TO_WEI} from 'logic/consts';
import {TransactionTypes} from 'ethers/lib/utils';
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
    for (let k = 0; k < txs_pending.length; k++) {
        var tx = await provider.getTransaction(`0x${txs_pending[k]}`);
        if (tx) 
            txs.push(tx);
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
        pendingTable[i]['maxFeePerGas'] = fee * GWEI_TO_WEI;
        pendingTable[i]['maxPriorityFeePerGas'] = priority * GWEI_TO_WEI;
    }
    console.log(pendingTable);
    await ProcessTransactions(wallets, pendingTable, setPendingTable);
}

async function SpeedupPercent(wallets, pendingTable, setPendingTable, percent) {
    for (let i = 0; i < pendingTable.length; i++) {
        var fee = parseInt(pendingTable[i]['maxFeePerGas']);
        var priority = parseInt(pendingTable[i]['maxPriorityFeePerGas']);
        pendingTable[i]['maxFeePerGas'] = fee + (fee /100) * percent;
        pendingTable[i]['maxPriorityFeePerGas'] = priority + (priority / 100) * percent;
    }
    console.log(pendingTable);
    await ProcessTransactions(wallets, pendingTable, setPendingTable);
}

async function ProcessTransactions(wallets, txs, setPendingTable) {
    var _pendingTable = [...txs];
    for (let i = 0; i < txs.length; i++) {
        try {
            var wallet = wallets.filter((w) => w['address'].toLowerCase() == txs[i]['from'].toLowerCase())[0]['wallet'];
            SendTransaction(wallet, txs[i], _pendingTable, setPendingTable);
        } catch (e) {
            console.log(e);
        }
    }
}

async function SendTransaction(wallet, tx, pendingTable, setPendingTable) {
    try {
        pendingTable = pendingTable.filter((p) => p['hash'] != tx['hash']);
        setPendingTable([...pendingTable]);
        tx = DeleteExcess(tx);
        var result = await wallet.sendTransaction(tx);
        pendingTable.push(result);
        setPendingTable([...pendingTable]);
        var receipt = await result.wait();
        result['confirmations'] = 1;
        setPendingTable([...pendingTable]);
    } catch (e) {
        console.log(e);
        return;
    }
}
