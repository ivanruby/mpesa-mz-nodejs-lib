module.exports = async function(transaction){
    console.log("=== Verifying that properties of the Transaction object are created")
    console.log("Expect: values from .env file \n")
    console.log("Fail: null \n\n")

    // Checking if options data is stored on instance of Transaction
    console.log("Public key: " + (transaction.hasOwnProperty('_public_key')? transaction._public_key : "null"))
    console.log("API host: " + (transaction.hasOwnProperty('_api_host')? transaction._api_host : "null"))
    console.log("API key: " + (transaction.hasOwnProperty('_api_key')? transaction._api_key : "null"))
    console.log("Origin: " + (transaction.hasOwnProperty('_origin')? transaction._origin : "null"))
    console.log("Service provider code: " + (transaction.hasOwnProperty('_service_provider_code')? transaction._service_provider_code : "null"))
    console.log("Initiator identifier: " + (transaction.hasOwnProperty('_initiator_identifier')? transaction._initiator_identifier : "null"))
    console.log("Security credential: " + (transaction.hasOwnProperty('_security_credential')? transaction._security_credential : "null"))
}