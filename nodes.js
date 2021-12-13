const serverUrl = "https://dj2d6jh9yctg.usemoralis.com:2053/server";
const appId = "kiGgE1ICN1USnRjS7HBI46CqJtwfgyuFxmSXnaQg";
Moralis.start({ serverUrl, appId });


// BNB NODE CONNECTION
const NODE_URL_BNB = "https://speedy-nodes-nyc.moralis.io/87ce6f23b59f3e846d3dc9c6/bsc/testnet";
const provider_BNB = new Web3.providers.HttpProvider(NODE_URL_BNB);
const web3_BNB = new Web3(provider_BNB);
// BNB NODE CONNECTION

// ETH NODE CONNECTION
const NODE_URL_ETH = "https://speedy-nodes-nyc.moralis.io/87ce6f23b59f3e846d3dc9c6/eth/rinkeby";
const provider_ETH = new Web3.providers.HttpProvider(NODE_URL_ETH);
const web3_ETH = new Web3(provider_ETH);
// ETH NODE CONNECTION

web3_BNB.eth.getTransaction('0x616c6179ae2693fb4c2073819dfc03d5a63e39b23d85402843239d2fb398148f').then(console.log);
web3_ETH.eth.getTransaction('0x92df9e34a3b6a37d343e5f2d0649ecccbdaa8e1584bbc78b8f15dbc975b63281').then(console.log);


async function get_trans(){
    const options = { chain: "bsc", address: "0x2E940afb4035E846Bc09c387578F2aED1C3c6d0D", order: "desc", from_block: "0" };
    const transactions = await Moralis.Web3API.account.getTransactions(options);
    console.log(transactions);
}
get_trans();