# mpesa-nodejs-api - Not yet functional
![GitHub](https://img.shields.io/github/license/ivanruby/mpesa-nodejs-api)


A Node.js version of the M-Pesa Mozambique API

Initially, a port of [mpesa-php-api](https://github.com/abdulmueid/mpesa-php-ap) to Node.js


## Goals

Provide a straightforward, Promise-based implementation of the M-Pesa API in Node.js.
Also, be an agnostic-library by treating config and transaction details as data, rather than dependencies


### Customer to Business (C2B) transaction
```javascript
Transaction = require('mpesa-nodejs-api')
let config = {
    public_key: '',
    api_host: 'api.sandbox.vm.co.mz',
    api_key: '',
    origin: '',
    service_provider_code: '',
    initiator_identifier: '',
    security_credential: ''
}

transaction = new Transaction(config)

transaction.c2b({
    amount: 1,
    msisdn: '',
    reference: '',
    third_party_reference: ''
    })
    .then(function(response){
        console.log(response)
    })
    .catch(function(error){
        console.log(error)
    })
```

### Querying status of an existing transaction
```javascript
Transaction = require('mpesa-nodejs-api')

let config = {
    public_key: '',
    api_host: 'api.sandbox.vm.co.mz',
    api_key: '',
    origin: '',
    service_provider_code: '',
    initiator_identifier: '',
    security_credential: ''
}

transaction = new Transaction(config)

transaction.query({
    reference: '',
    third_party_reference: ''
    })
    .then(function(response){
        console.log(response)
    })
    .catch(function(error){
        console.log(error)
    })
```

### Reversal of an existing transaction
```javascript
Transaction = require('mpesa-nodejs-api')

let config = {
    public_key: '',
    api_host: 'api.sandbox.vm.co.mz',
    api_key: '',
    origin: '',
    service_provider_code: '',
    initiator_identifier: '',
    security_credential: ''
}

transaction = new Transaction(config)

transaction.query({
    amount: 1,
    transaction_id: '',
    third_party_reference: ''
    })
    .then(function(response){
        console.log(response)
    })
    .catch(function(error){
        console.log(error)
    })
```

## License
[MIT License](LICENSE) &copy; 2020 Ivan Ruby