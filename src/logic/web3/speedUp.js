import { ethers } from 'ethers';
import { GetUncorfimedHashes } from './blockCypherWrapper';

export async function GetPendings(privateKeys, rpc, setPendingTable) {
  var provider = new ethers.providers.JsonRpcProvider(rpc);
  var wallets = [];
  for (let i = 0; i < privateKeys.length; i++) {
    wallets.push(new ethers.Wallet(privateKeys[i], provider));
  }
  var txs = [];
  var txs_pending = [];
  for (let k = 0; k < wallets.length; k++) {
    var address = await wallets[k].getAddress();
    txs_pending.push(...(await GetUncorfimedHashes(address)));
  }
  for (let k = 0; k < txs_pending.length; k++) {
    var tx = await provider.getTransaction(`0x${txs_pending[k]}`);
    txs.push(tx);
  }
  setPendingTable(txs);
  console.log(txs)
}

export async function SpeedUp(privateKeys, rpc, setPendingTable) {}
