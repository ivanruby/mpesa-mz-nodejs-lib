require('dotenv').config()
Transaction = require('../src/transaction.js')

config = require('./tx_config.js')
c2b = require('./tx_c2b.js')
reversal = require('./tx_reversal.js')
query = require('./tx_query')

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

// Uncomment the feature to test - it is advised to test each individually, not sequentially at this point

/** @test {transaction#config} */
config(transaction)

/** @test {transaction#c2b} */
// c2b(transaction)

/** @test {transaction#query} */
// query(transaction)

/** @test {transaction#reversal} */
// reversal(transaction)
