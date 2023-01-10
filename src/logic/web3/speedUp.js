import { ethers } from "ethers";
import { GetUncorfimedHashes } from "./blockCypherWrapper";

export async function SpeedUp(privateKeys, rpc){
    var provider = new ethers.providers.JsonRpcProvider(rpc);
    var wallets = []
    for(let i = 0; i < privateKeys.length; i++){
        wallets.push(new ethers.Wallet(privateKeys[i], provider));
    }
    var pending_info = {}
    for(let k = 0; k < wallets.length; k++){
        var address = await wallets[k].getAddress();
        pending_info[address] = await GetUncorfimedHashes(address);   
    }
    console.log(pending_info)
}