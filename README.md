# mpesa-nodejs-api - Not yet functional
![GitHub](https://img.shields.io/github/license/ivanruby/mpesa-nodejs-api)


A Node.js version of the M-Pesa Mozambique API

Initially, a port of [mpesa-php-api](https://github.com/abdulmueid/mpesa-php-ap) to Node.js


## Goals

Provide a straightforward, Promise-based implementation of the M-Pesa API in Node.js.
Also, be an agnostic-library by treating config and transaction details as data, rather than dependencies


### Customer to Business (C2B) transaction
```javascript
// include the library
Transaction = require('mpesa-nodejs-api')

// create the config object
let config = {
    public_key: '<Public key>',
    api_host: 'api.sandbox.vm.co.mz',
    api_key: '<API key>',
    origin: '<Origin>',
    service_provider_code: '<Service provider code>',
    initiator_identifier: '<Initiator Identifier>',
    security_credential: '<Security Credential>'
}

// instantiate the Transaction object, initializing it with valid config
transaction = new Transaction(config)

// initiate a promise-based C2B transaction
transaction.c2b({
        amount: <floating-point number>,
        msisdn: '<valid/invalid MSISDN>',
        reference: '<Transaction Reference>',
        third_party_reference: '<Third-party reference>'
        })
    // handle success
    .then(function(response){
        console.log(response)
    })
    // handle error
    .catch(function(error){
        console.log(error)
    })
```

### Querying status of an existing transaction
```javascript
// include the library
Transaction = require('mpesa-nodejs-api')

// create the config object
let config = {
    public_key: '<Public key>',
    api_host: 'api.sandbox.vm.co.mz',
    api_key: '<API key>',
    origin: '<Origin>',
    service_provider_code: '<Service provider code>',
    initiator_identifier: '<Initiator Identifier>',
    security_credential: '<Security Credential>'
}

// instantiate the Transaction object, initializing it with valid config
transaction = new Transaction(config)

// query the status of an existing transaction
transaction.query({
        reference: '<Transaction reference>',
        third_party_reference: '<Third-party reference>'
    })
    // handle success
    .then(function(response){
        console.log(response)
    })
    // handle error
    .catch(function(error){
        console.log(error)
    })
```

### Reversal of an existing transaction
```javascript
// include the library
Transaction = require('mpesa-nodejs-api')

// create the config object
let config = {
    public_key: '<Public key>',
    api_host: 'api.sandbox.vm.co.mz',
    api_key: '<API key>',
    origin: '<Origin>',
    service_provider_code: '<Service provider code>',
    initiator_identifier: '<Initiator Identifier>',
    security_credential: '<Security Credential>'
}

// instantiate the Transaction object, initializing it with valid config
transaction = new Transaction(config)

// Reverse a committed transaction
transaction.reverse({
        amount: <floating-point number>,
        transaction_id: '<Transaction ID>',
        third_party_reference: '<Third-party reference>'
    })
    // Handle success
    .then(function(response){
        console.log(response)
    })
    // Handle error
    .catch(function(error){
        console.log(error)
    })
```

## License
[MIT License](LICENSE) &copy; 2020 Ivan Ruby