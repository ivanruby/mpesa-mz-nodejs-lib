const NodeRSA = require('node-rsa')

module.exports = {
    requestIsValid: function(request){
        // amount param is valid
        if ( !(transaction_data.amount && parseFloat(transaction_data.amount) > 0) )
            return new Error("Missing or invalid C2B transaction data: Amount")
        
        // msisdn param is valid
        if ( !(transaction_data.msisdn && helpers.isValidMSISDN(transaction_data.msisdn)) )
            return new Error("Missing or invalid C2B transaction data: MSISDN")

        // reference param is valid
        if ( !(transaction_data.reference && transaction_data.reference != '') )
            return new Error("Missing or invalid C2B transaction data: Reference")
        
        // third_party_reference param is valid
        if ( !(transaction_data.third_party_reference && transaction_data.third_party_reference != '') )
            return new Error("Missing or invalid C2B transaction data: Third party reference")
        //transaction_data.msisdn = helpers.normalizeMSISDN(transaction_data.msisdn)
        transaction_data.amount = Number.parseFloat(transaction_data.amount).toFixed(2)
    },
    isValidMSISDN: function(msisdn){
        let msisdn_length = msisdn.toString().length

        // Is it 84XXXXXXX or 25884XXXXXXX
        return msisdn_length == 9 || msisdn_length == 12 
    },

    normalizeMSISDN: function(msisdn){
        return ''
    },

    NodeRSA: NodeRSA
}