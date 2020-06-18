const axios = require('axios')

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
    c2b = function(amount, msisdn, reference, third_party_reference){
        this.msisdn = normalizeMSISDN(msisdn);
        this.amount = round(amount, 2);
        this.payload = {
            input_ServiceProviderCode:  this.service_provider_code,
            input_CustomerMSISDN:       msisdn,
            input_Amount:               amount,
            input_TransactionReference: reference,
            input_ThirdPartyReference:  third_party_reference
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
            return response
        })
    }

    // Helpers
    normalizeMSISDN = function(msisdn){

    }
}

export default Transaction