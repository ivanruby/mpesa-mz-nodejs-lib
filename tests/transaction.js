require('dotenv').load()
Transaction = require('../src/transaction.js')

let opts = {
    public_key: process.env.PUBLIC_KEY,
    api_host: process.env.API_HOST,
    api_key: process.env.API_KEY,
    origin: process.env.ORIGIN,
    service_provider_code: process.env.SERVICE_PROVIDER_CODE,
    initiator_identifier: process.env.INITIATOR_IDENTIFIER,
    security_credential: process.env.SECURITY_CREDENTIAL
}

transaction = new Transaction(opts)

transaction.c2b()
    .then(function(response){
        console.log('Success!')
        console.log(response)
    })
    .error(function(response){
        console.log('Error')
        console.log(response)
    })