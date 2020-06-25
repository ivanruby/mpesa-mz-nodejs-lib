require('dotenv').config()
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

console.log(" ================ Starting Tests ==================")

console.log("Verifying that properties of the Transaction object are created")
console.log("Expect values from .env file \n")

// Checking if options data is stored on instance of Transaction
console.log("Public key: " + (transaction.hasOwnProperty('public_key')? transaction.public_key : "null"))
console.log("API host: " + (transaction.hasOwnProperty('api_host')? transaction.api_host : "null"))
console.log("API key: " + (transaction.hasOwnProperty('api_key')? transaction.api_key : "null"))
console.log("Origin: " + (transaction.hasOwnProperty('origin')? transaction.origin : "null"))
console.log("Service provider code: " + (transaction.hasOwnProperty('service_provider_code')? transaction.service_provider_code : "null"))
console.log("Initiator identifier: " + (transaction.hasOwnProperty('initiator_identifier')? transaction.initiator_identifier : "null"))
console.log("Security credential: " + (transaction.hasOwnProperty('security_credential')? transaction.security_credential : "null"))

console.log("Now, verifying that a C2B occurs")
// transaction.c2b()
//     .then(function(response){
//         console.log('Success!')
//         console.log(response)
//     })
//     .error(function(response){
//         console.log('Error')
//         console.log(response)
//     })