# mpesa-nodejs-api 
![GitHub](https://img.shields.io/github/license/ivanruby/mpesa-nodejs-api)


Node.js version of the mpesa Mozambique API

Initially, a port of [mpesa-php-api](https://github.com/abdulmueid/mpesa-php-ap) to Node.js

## Usage

### 1. Test/Develop
```
npm install mpesa-nodejs-api
cd mpesa-nodjs-api
npm .
npm run test
```

### Sample usage: Customer to Business (C2B) transaction
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

### Sample usage: Querying status of an existing transaction
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

### Sample usage: Reversal of an existing transaction
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