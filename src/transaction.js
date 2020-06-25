const axios = require('axios')
const helpers = require("utils/helpers.js")

function Transaction(options){
    // Configuration variables
    this.public_key =               options.public_key,
    this.api_host =                 options.api_host,
    this.api_key =                  options.api_key,
    this.origin =                   options.origin,
    this.service_provider_code =    options.service_provider_code,
    this.initiator_identifier =     options.initiator_identifier,
    this.security_credential =      options.security_credential

    // Transaction-specific variables
    this.amount;
    this.msisdn;
    this.reference;
    this.third_party_reference;

    /**
     * Initiates a C2B transaction on the M-Pesa API.
     * @param float $amount
     * @param string $msisdn
     * @param string $reference
     * @param string $third_party_reference
     * @return TransactionResponse
     * @throws Exception
     */
    this.c2b = function(transaction_data){
        /*
            Check existence and validity of each transaction_data obj property
        */

        // amount param is valid
        if ( !(transaction_data.hasOwnProperty("amount") && transaction_data.amount > 0) )
            return new Error("Missing or invalid C2B transaction data: Amount")
        
        // msisdn param is valid
        if ( !(transaction_data.hasOwnProperty("msisdn") && helpers.isValidMSISDN(transaction_data.msisdn)) )
            return new Error("Missing or invalid C2B transaction data: MSISDN")

        // reference param is valid
        if ( !(transaction_data.hasOwnProperty("reference") && transaction_data.reference != '') )
            return new Error("Missing or invalid C2B transaction data: Reference")
        
        // third_party_reference param is valid
        if ( !(transaction_data.hasOwnProperty('third_party_reference') && transaction_data.third_party_reference != '') )
            return new Error("Missing or invalid C2B transaction data: Third party reference")
        
        // If all transaction properties exist and are valid, return promise
        return new Promise(function (resolve, reject) {
            transaction_data.msisdn = helpers.normalizeMSISDN(transaction_data.msisdn)
            transaction_data.amount = Number.parseFloat(transaction_data).toFixed(2)

            this.payload = {
                input_ServiceProviderCode:  this.service_provider_code,
                input_CustomerMSISDN:       transaction_data.msisdn,
                input_Amount:               transaction_data.amount,
                input_TransactionReference: transaction_data.reference,
                input_ThirdPartyReference:  this.third_party_reference
            }
            
            let url = 'https://' + this.api_host + ':18352/ipg/v1x/c2bPayment/singleStage/'

            axios({
                method: 'post',
                url: url,
                data: payload,
                headers: {
                    'Content-Type ':   'application/json',
                    'Content-Length ':  payload.length,
                    'Origin ':          this.origin,
                    'Authorization: ':  this.getBearerToken()
                }
            })
            .then(function(response){
                resolve(response)
            })
            .catch(function(error){
                reject(error) 
            })
        })
    }
}

module.exports = Transaction
