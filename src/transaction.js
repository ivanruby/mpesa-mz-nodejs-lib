const axios = require('axios')
const helpers = require("./utils/helpers.js")

function Transaction(options){
    // Configuration variables
    this.public_key =               options.public_key,
    this.api_host =                 options.api_host,
    this.api_key =                  options.api_key,
    this.origin =                   options.origin,
    this.service_provider_code =    options.service_provider_code,
    this.initiator_identifier =     options.initiator_identifier,
    this.security_credential =      options.security_credential

    /**
     * Generates a Bearer Token 
     * @returns bearer_token
     */
    this.getBearerToken = function(){
        // Structuring certificate string
        let certificate = "-----BEGIN PUBLIC KEY-----\n"
        certificate += helpers.wordwrap(this.public_key,{width: 60, cut: true, indent: ''})
        certificate += "\n-----END PUBLIC KEY-----"

        // Exctract public key from formatted certificate
        let pk = new helpers.NodeRSA()
        pk.setOptions({encryptionScheme: 'pkcs1'})
        pk.importKey(Buffer.from(certificate), 'public')

        // Encryt API key (data) using public key 
        let token = pk.encrypt(Buffer.from(this.api_key))
        
        //console.log(token)
        // Return formatted string, Bearer token 
        return 'Bearer ' + Buffer.from(token).toString('base64')
    }

    /**
     * Initiates a C2B transaction on the M-Pesa API.
     * @param float $amount
     * @param string $msisdn
     * @param string $reference
     * @param string $third_party_reference
     * @return TransactionResponse
     * @throws Exception
     */
    this.c2b = async function(transaction_data){
        /*
            Check existence and validity of each transaction_data obj property
        */

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
         
        let config = {
            url: 'https://' + this.api_host + ':18352/ipg/v1x/c2bPayment/singleStage/',
            service_provider_code: this.service_provider_code,
            third_party_reference: transaction_data.third_party_reference,
            bearerToken: this.getBearerToken(),
            origin: this.origin
        }
        // If all transaction properties exist and are valid, return promise
        return await new Promise(function (resolve, reject) {
            //transaction_data.msisdn = helpers.normalizeMSISDN(transaction_data.msisdn)
            transaction_data.amount = Number.parseFloat(transaction_data.amount).toFixed(2)

            let payload = {
                input_ServiceProviderCode:  config.service_provider_code,
                input_CustomerMSISDN:       transaction_data.msisdn,
                input_Amount:               transaction_data.amount.toString(),
                input_TransactionReference: transaction_data.reference,
                input_ThirdPartyReference:  config.third_party_reference
            }

            axios({
                method: 'post',
                url: config.url,
                data: payload,
                headers: {
                    'Content-Type':   'application/json',
                    'Origin':          config.origin,
                    'Authorization':  config.bearerToken
                }
            })
            .then(function(response){
                resolve(response)
            })
            .catch(function(error){
                reject(error) 
            })
        })
    },

    /**
     * Initiates a transaction Query on the M-Pesa API.
     * @param string $query_reference
     * @param string $third_party_reference
     * @return TransactionResponseInterface
     */
    this.query = async function (query_data) {
        let config = {
            url: 'https://' + this.api_host + ':18353/ipg/v1x/queryTransactionStatus/',
            service_provider_code: this.service_provider_code,
            bearerToken: this.getBearerToken(),
            origin: this.origin
        }

        // If all transaction properties exist and are valid, return promise
        return await new Promise(function (resolve, reject) {
            let payload = {
                'input_QueryReference': query_data.query_reference,
                'input_ServiceProviderCode': config.service_provider_code,
                'input_ThirdPartyReference': query_data.third_party_reference
            }
            
            axios({
                method: 'get',
                url: config.url,
                data: payload,
                headers: {
                    'Content-Type':   'application/json',
                    'Authorization':  config.bearerToken,
                    'Origin':          config.origin
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

    /**
     * Initiates a transaction Query on the M-Pesa API.
     * @param float amount
     * @param string transaction_id
     * @param string third_party_reference
     * @return TransactionResponse
     */
    this.reverse = function (transaction_data) {
        let config = {
            url: 'https://' + this.api_host + ':18354/ipg/v1x/reversal/',
            service_provider_code: this.service_provider_code,
            initiator_identifier: this.initiator_identifier,
            security_credential: this.security_credential,
            third_party_reference: "11114",
            bearerToken: this.getBearerToken(),
            origin: this.origin
        }

        // If all transaction properties exist and are valid, return promise
        return new Promise(function (resolve, reject) {
            transaction_data.amount = Number.parseFloat(transaction_data.amount).toFixed(2)
            
            let payload = {
                input_ReversalAmount:       transaction_data.amount.toString(),
                input_TransactionID:        transaction_data.transaction_id,
                input_ThirdPartyReference:  transaction_data.third_party_reference,
                input_ServiceProviderCode:  config.service_provider_code,
                input_InitiatorIdentifier:  config.initiator_identifier,
                input_SecurityCredential:   config.security_credential
            }
            
            axios({
                method: 'put',
                url: config.url,
                data: payload,
                headers: {
                    'Content-Type':   'application/json',
                    'Authorization':  config.bearerToken,
                    'Origin':          config.origin
                }
            })
            .then(function(response){
                resolve(response.data)
            })
            .catch(function(error){
                reject(error.data) 
            })
        })
    }
}

module.exports = Transaction