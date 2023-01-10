


async function GetUncorfimedHashes(address){
    var r = await fetch(`https://api.blockcypher.com/v1/eth/main/addrs/${address}`)
    var json = await r.json()
    var pendings = json['unconfirmed_txrefs']
    return pendings.map(p => p['tx_hash'])
}
