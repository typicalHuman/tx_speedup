export async function GetUncorfimedHashes(address) {
  var r = await fetch(
    `https://api.blockcypher.com/v1/eth/main/addrs/${address}`
  );
  var json = await r.json();
  var tx_refs = json['txrefs'];
  var last_nonce = Date.parse(tx_refs[0]['confirmed']);
  var pendings = json['unconfirmed_txrefs'];
  var _pendings = [];
  for (let i = 0; i < pendings.length; i++) {
    if (Date.parse(pendings[i]['received']) > last_nonce) {
      _pendings.push(pendings[i]);
    }
  }
  var unconfirmed = _pendings.map((p) => p['tx_hash']);
  return unconfirmed;
}
