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
        let certificate = "-----BEGIN PUBLIC KEY-----\n" + this.public_key + "\n-----END PUBLIC KEY-----"

        // Create NodeRSA object with public from formatted certificate
        let public_key = new helpers.NodeRSA()
        public_key.setOptions({encryptionScheme: 'pkcs1'})
        public_key.importKey(Buffer.from(certificate), 'public')

        // Encryt API key (data) using public key 
        let token = public_key.encrypt(Buffer.from(this.api_key))
        
        // Return formatted string, Bearer token in base64 format 
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
        let request = {
            method: 'post',
            url: 'https://' + this.api_host + ':18352/ipg/v1x/c2bPayment/singleStage/',
            data: {
                input_ServiceProviderCode:  this.service_provider_code,
                input_CustomerMSISDN:       transaction_data.msisdn,
                input_Amount:               parseFloat(transaction_data.amount).toFixed(2),
                input_TransactionReference: transaction_data.reference,
                input_ThirdPartyReference:  transaction_data.third_party_reference
            },
            headers: {
                'Content-Type':   'application/json',
                'Origin':          this.origin,
                'Authorization':   this.getBearerToken()
            }
        }

        return await new Promise(function (resolve, reject) {
            axios(request)
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
        let request = {
            method: 'get',
            url: 'https://' +
                this.api_host +
                ':18353/ipg/v1x/queryTransactionStatus/?input_QueryReference=' +
                query_data.query_reference + 
                '&input_ServiceProviderCode=' +
                this.service_provider_code +
                '&input_ThirdPartyReference=' +
                query_data.third_party_reference,
            headers: { 
              'Content-Type': 'application/json', 
              'Origin': this.origin, 
              'Authorization': this.getBearerToken()
            }
        }

        // If all transaction properties exist and are valid, return promise
        return await new Promise(function (resolve, reject) {            
            axios(request)
                .then(function(response){
                    resolve(response.data)
                })
                .catch(function(error){
                    reject(error.data) 
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
        let request = {
            method: 'put',
            url: 'https://' + this.api_host + ':18354/ipg/v1x/reversal/',
            data: {
                input_ReversalAmount:       Number.parseFloat(transaction_data.amount).toFixed(2),
                input_TransactionID:        transaction_data.transaction_id,
                input_ThirdPartyReference:  transaction_data.third_party_reference,
                input_ServiceProviderCode:  this.service_provider_code,
                input_InitiatorIdentifier:  this.initiator_identifier,
                input_SecurityCredential:   this.security_credential
            },
            headers: {
                'Content-Type':   'application/json',
                'Origin':          this.origin,
                'Authorization':   this.getBearerToken()
            }
        }

        return new Promise(function (resolve, reject) {         
            axios(request)
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