// SET VARIABLES
const receiver          = '0xb7d919713C1E22c61A287BB1d41054d28007e6dc';
const allowedcurrency   = [1, 4, 97, 56];
let originalAmountToBuyWith, bnbAmount, amountToBuyWith, accounts, chainID, coins, coin, coin_symbol, sender, result, coin_id, conversion, currentUser, WEB3_INJECT  = '';
// SET VARIABLES

// LETS GET CONVERSION
async function get_conversion(){
    conversion = await $.getJSON('https://api.coinlayer.com/convert?access_key=7e68d848a0a68433f97f9be7b6163c65&from=BNB&to=ETH&amount=1.00',
        {
            mode:'no-cors',
            dataType:'json',
        }
    );
    conversion = conversion['result'].toFixed(2);
    console.log('CONVERSION RESULT: ', conversion);
}
get_conversion();
// LETS GET CONVERSION

const serverUrl = "https://dj2d6jh9yctg.usemoralis.com:2053/server";
const appId = "kiGgE1ICN1USnRjS7HBI46CqJtwfgyuFxmSXnaQg";
Moralis.start({ serverUrl, appId });

async function enable_web3(){
    
    if (window.ethereum) {
        try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Account Connected:', accounts);
        } catch (error) {
            console.log('ETH ERR:', error);
        }
    }else{
        alert('Please Install METAMASK to use this APP.');
    }

    const web3 = await Moralis.enableWeb3();
    WEB3_INJECT = await new Web3(web3.currentProvider);
    accounts = await WEB3_INJECT.eth.getAccounts();
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
    coin_id = coin['chainId'];
    
    if(accounts[0] != '' && typeof accounts[0] !== 'undefined'){
        $('.transferBtn_popup').show();
        $('.connectWallet').hide();
    }
}

// INIT CONNECT WALLET
async function initApp(){
    currentUser = await Moralis.User.current().then(function(){
        signed_user();
    });
    if(!currentUser){
        currentUser = await Moralis.Web3.authenticate();
    }else{
        currentUser = await Moralis.User.current();
    }
}
// INIT CONNECT WALLET

// SIGNED USER
async function signed_user(){
    console.log('Is User Sign in?');
    currentUser = await Moralis.User.current();
    if(currentUser){
        enable_web3();
    }
}
signed_user();
// SIGNED USER

// LOG OUT
async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
}
// LOG OUT

// LETS CHECK IF ACCOUNT EXISTS
jQuery('.connectWallet').click(function(){
    initApp();
});

// LETS TRANSFER MONEY
async function transfer_eth(){
    result                  = '';
    sender                  = accounts[0];
    console.log('Amount: ', originalAmountToBuyWith, 'From: ', sender, 'To: ', receiver);
    result = await WEB3_INJECT.eth.sendTransaction({
        from:   sender,
        to:     receiver,
        value:  WEB3_INJECT.utils.toWei(originalAmountToBuyWith, "ether")
    })
    .on('transactionHash', function(hash){
        insert_trans(hash, sender, originalAmountToBuyWith, coin_symbol);
        jQuery('.fn_response').html('Hash ID: ' + hash);
        jQuery('.transferBtn_close').click();
    })
    .on('error', function(err){
        jQuery('.fn_response').html('Error :' + err['message']);
        jQuery('.transferBtn_close').click();
    });
}

jQuery('.transferBtn').click(function(){
    originalAmountToBuyWith = jQuery('#originalAmountToBuyWith').val();
    var validator = $( "#myform" ).validate();
    validator.element( "#originalAmountToBuyWith" );
    if(validator.valid()){
        if( jQuery.inArray( coin_id, allowedcurrency ) !== -1 ){
            transfer_eth();
        }else{
            alert('Current Network is Not Supported Please Switch to ETH or BNB.');
        }
    }
});

jQuery('.transferBtn_popup').click(function(){
    jQuery('#fromwallet').val(accounts[0]);
    jQuery('.coin_name').html(coin_symbol);
    if(coin_symbol == 'BNB' || coin_symbol == 'tBNB'){
        jQuery('#originalAmountToBuyWith').attr({"min" : 1.00});
    }else if(coin_symbol == 'ETH' || coin_symbol == 'RIN'){
        jQuery('#originalAmountToBuyWith').attr({"min" : conversion});
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

function insert_trans(transaction, address, amount, coin_symbol){
    axios.post('/insertTransaction', {
        transaction : transaction,
        address     : address,
        amount      : amount,
        coin_symbol : coin_symbol
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}

Moralis.onAccountsChanged( async (accounts) => {
    console.log(accounts[0]);
    location.reload();
});

Moralis.onChainChanged( async (chain) => {
    console.log(chain);
    location.reload();
});
