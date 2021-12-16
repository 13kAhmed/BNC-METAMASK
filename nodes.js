const serverUrl = "https://dj2d6jh9yctg.usemoralis.com:2053/server";
const appId = "kiGgE1ICN1USnRjS7HBI46CqJtwfgyuFxmSXnaQg";
Moralis.start({ serverUrl, appId });

let transactions_bsc = [];
let transactions_eth = [];

async function get_transactions_eth(address){
    const query         = new Moralis.Query("EthTransactions");
    query.lessThanOrEqualTo( 'from_address', address );
    const results  = await query.find();
    for (let i = 0; i < results.length; i++) {
        const object = results[i];
        let hash = object.get('hash');
        let createdAt = object.get('createdAt');
        let nonce = object.get('nonce');
        let block_hash = object.get('block_hash');
        let from_address = object.get('from_address');
        transactions_eth.push(
            {
                hash:           hash,
                createdAt:      createdAt,
                nonce:          nonce,
                block_hash:     block_hash,
                from_address:   from_address,

            }
        );
    }
    console.log('ETH', transactions_eth);
}
get_transactions_eth('0xb7d919713c1e22c61a287bb1d41054d28007e6dc');

async function get_transactions_bsc(address){
    const query         = new Moralis.Query("BscTransactions");
    query.lessThanOrEqualTo( 'from_address', address );
    const results  = await query.find();
    for (let i = 0; i < results.length; i++) {
        const object = results[i];
        let hash = object.get('hash');
        let createdAt = object.get('createdAt');
        let nonce = object.get('nonce');
        let block_hash = object.get('block_hash');
        let from_address = object.get('from_address');
        transactions_bsc.push(
            {
                hash:           hash,
                createdAt:      createdAt,
                nonce:          nonce,
                block_hash:     block_hash,
                from_address:   from_address,

            }
        );
    }
    console.log('BSC ', transactions_bsc);
}
get_transactions_bsc('0xb7d919713c1e22c61a287bb1d41054d28007e6dc');

