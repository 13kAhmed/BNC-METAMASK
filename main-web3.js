let originalAmountToBuyWith, bnbAmount, amountToBuyWith, accounts, chainID, coins, coin, coin_symbol, sender, result, coin_id, conversion = '';
const receiver          = '0xb7d919713C1E22c61A287BB1d41054d28007e6dc';
const allowedcurrency   = [1, 4, 97, 56];

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    //web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org:443"));
    web3 = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545"));
}

// LETS GET CONVERSION
async function get_conversion(){
    conversion = await $.getJSON('https://api.coinlayer.com/convert?access_key=7e68d848a0a68433f97f9be7b6163c65&from=BNB&to=ETH&amount=1',
        {
            mode:'no-cors',
            dataType:'json',
        }
    );
    conversion = conversion['result'].toFixed(2);
}
get_conversion();
// LETS GET CONVERSION

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
    coin_id = coin['chainId'];
    if(accounts[0] != '' && typeof accounts[0] !== 'undefined'){
        $('.transferBtn_popup').show();
        $('.connectWallet').hide();
    }
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
    result = await web3.eth.sendTransaction({
        from:   sender,
        to:     receiver,
        value:  web3.utils.toWei(originalAmountToBuyWith, "ether")
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
        jQuery('#originalAmountToBuyWith').attr({"min" : 1});
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
    var request = jQuery.ajax({
        url: "script.php",
        type: "POST",
        data: {address : address, amount : amount, coin_symbol : coin_symbol, transaction : transaction},
        dataType: "json"
    });
      
    request.done(function(result) {
        
    });
      
    request.fail(function(jqXHR, textStatus) {
        
    });
}