let originalAmountToBuyWith, bnbAmount, amountToBuyWith, accounts, chainID, coins, coin, coin_symbol, sender, result = '';
const receiver = '0xb7d919713C1E22c61A287BB1d41054d28007e6dc';

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    //web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org:443"));
    web3 = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545"));
}
// LETS CHECK IF ACCOUNT EXISTS
async function metamask_getAccouts() {
    accounts = await web3.eth.getAccounts();
    chainID = await web3.eth.getChainId();
    coins = await $.getJSON('https://chainid.network/chains.json',
        {
            mode:'no-cors',
            dataType:'json',
        }
    );
    coin = functiontofindIndexByKeyValue(coins, 'chainId', chainID);
    coin = coins[coin];
    coin_symbol = coin['nativeCurrency']['symbol'];
    if(accounts[0] != '' && typeof accounts[0] !== 'undefined'){
        $('.transferBtn_popup').show();
        $('.connectWallet').hide();
    }
    console.log(web3);
}

metamask_getAccouts();
// LETS CHECK IF ACCOUNT EXISTS

// LETS CONNECT WALLET
async function connect_only_metamask() {
    accounts = await web3.eth.getAccounts();
    if (window.ethereum) {
        try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            metamask_getAccouts();
            console.log('ETH Success:', accounts);
        } catch (error) {
            console.log('ETH ERR:', error);
          }
    }else{
        alert('Please Install METAMASK to use this APP.');
    }
}

$('.connectWallet').click(function(){
    connect_only_metamask();
})
// LETS CONNECT WALLET

// LETS TRANSFER MONEY
async function transfer_eth(){
    accounts                = await web3.eth.getAccounts();
    result                  = '';
    sender                  = accounts[0];
    console.log('Amount: ', originalAmountToBuyWith, 'From: ', sender, 'To: ', receiver);
    result = await web3.eth.sendTransaction({to:receiver, from:sender, value:web3.utils.toWei(originalAmountToBuyWith, "ether")}, function(err, transactionHash) {
        if (err) {
            console.log('Transaction Error: ', err);
        } else {
            console.log('Transaction Done: ', transactionHash);
            jQuery('.transferBtn_close').click();
        }
      });
}

jQuery('.transferBtn').click(function(){
    originalAmountToBuyWith = jQuery('#originalAmountToBuyWith').val();
    var validator = $( "#myform" ).validate();
    validator.element( "#originalAmountToBuyWith" );
    if(validator.valid()){
        transfer_eth();
    }
});

jQuery('.transferBtn_popup').click(function(){
    jQuery('#fromwallet').val(accounts[0]);
    jQuery('.coin_name').html(coin_symbol);
    if(coin_symbol == 'BNB' || coin_symbol == 'tBNB'){
        jQuery('#originalAmountToBuyWith').attr({"min" : 1});
    }
});
// LETS TRANSFER MONEY

function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i][key] == valuetosearch) {
            return i;
        }
    }
    return null;
}