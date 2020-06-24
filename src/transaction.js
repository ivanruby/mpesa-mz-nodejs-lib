const axios = require('axios')
const helper = require('utils/helpers.js')

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
     * @return TransactionResponseInterface
     * @throws Exception
     */
    const c2b = function (transaction_data) {
        return new Promise(function(resolve, reject){
            this.amount = round(amount, 2);
            this.payload = {
                input_ServiceProviderCode:  this.service_provider_code,
                input_CustomerMSISDN:       transaction_data.msisdn,
                input_Amount:               transaction_data.amount,
                input_TransactionReference: transaction_data.reference,
                input_ThirdPartyReference:  transaction_data.hird_party_reference
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
            .then(function(data){
                return response(data)
            })
            .catch(function(error){
                return reject(error)
            })
        }
    }
}

export default new Transaction;