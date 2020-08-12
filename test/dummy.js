Tx = require('../src/transaction')
require('dotenv').config()

let opts = {
    public_key: process.env.PUBLIC_KEY,
    api_host: process.env.API_HOST,
    api_key: process.env.API_KEY,
    origin: process.env.ORIGIN,
    service_provider_code: process.env.SERVICE_PROVIDER_CODE,
    initiator_identifier: process.env.INITIATOR_IDENTIFIER,
    security_credential: process.env.SECURITY_CREDENTIAL
}

tx = new Tx(opts)

console.log("Attempting tx.query")

tx.query({
    query_reference: 'tvfs2503x1dja',
    third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
}).then(function(response){
    console.log(response)    
}).catch(function(error){
    console.log(error)
})