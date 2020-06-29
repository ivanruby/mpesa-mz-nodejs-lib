module.exports = async function(transaction){
    console.log("=== Verifying that properties of the Transaction object are created")
    console.log("Expect: values from .env file \n")
    console.log("Fail: null")

    // Checking if options data is stored on instance of Transaction
    console.log("Public key: " + (transaction.hasOwnProperty('public_key')? transaction.public_key : "null"))
    console.log("API host: " + (transaction.hasOwnProperty('api_host')? transaction.api_host : "null"))
    console.log("API key: " + (transaction.hasOwnProperty('api_key')? transaction.api_key : "null"))
    console.log("Origin: " + (transaction.hasOwnProperty('origin')? transaction.origin : "null"))
    console.log("Service provider code: " + (transaction.hasOwnProperty('service_provider_code')? transaction.service_provider_code : "null"))
    console.log("Initiator identifier: " + (transaction.hasOwnProperty('initiator_identifier')? transaction.initiator_identifier : "null"))
    console.log("Security credential: " + (transaction.hasOwnProperty('security_credential')? transaction.security_credential : "null"))
}