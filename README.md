# mpesa-mz-nodejs-lib [Not production-ready]

![GitHub](https://img.shields.io/github/license/ivanruby/mpesa-nodejs-api)

A Node.js library for the M-Pesa Mozambique API

Initially, a port of [mpesa-php-api](https://github.com/abdulmueid/mpesa-php-api) to Node.js

## Goals

Provide a straightforward, Promise-based implementation of the M-Pesa API in Node.js.
Also, be an agnostic-library by treating config and transaction details as data, rather than dependencies

## Status

- [x] C2B Transaction
- [x] Transaction status query
- [x] Transaction reversal

## Roadmap

- [] Unit tests passing for all features (v0.4.x)
- [] Code refactoring (entire codebase) (v0.5.x)
- [] Documentation (code coverage, features) (v0.6.x)
- [] Linting, code quality (v0.7.x)
- [] Continuous Integration (v0.8.x)
- [] Rename library (v0.9.x)
- [] All tests passing, functionalities stable (v1.0.0)

## Test

```
git clone https://github.com/ivanruby/mpesa-mz-nodejs-lib.git
cd mpesa-mz-nodejs-lib
npm install
```

Rename `example.env` to `.env` and populate the fields with the necessary values.

Next, run

`npm test`

## Documentation (Windows)

```
npm run docs
```

For mac, run `npm run docs:mac`

## Examples

### Installation

```
npm install mpesa-mz-nodejs-lib
```

### Customer to Business (C2B) transaction

```javascript
// include the library
Transaction = require('mpesa-mz-nodejs-lib')

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
// ... Assuming an initialized Transaction object

// query the status of an existing transaction
transaction
  .query({
    query_reference: "<Transaction reference>",
    third_party_reference: "<Third-party reference>",
  })
  // handle success
  .then(function (response) {
    console.log(response);
  })
  // handle error
  .catch(function (error) {
    console.log(error);
  });
```

### Reversal of an existing transaction

```javascript
// ... Assuming an initialized Transaction object

// Reverse a committed transaction
transaction
  .reverse({
    amount: "<floating-point number>",
    transaction_id: "<Transaction ID>",
    third_party_reference: "<Third-party reference>",
  })
  // handle success
  .then(function (response) {
    console.log(response);
  })
  // handle error
  .catch(function (error) {
    console.log(error);
  });
```

### Responses

Axios response object schema is structured as:

```
{
  status: '',
  statusText: '',
  headers: {},
  config: {},
  data: {}
}
```

In the current version of the library, all returned objects correspond to the entire `data` object.
TODO: Distinguish `response` (full Axios response object) from `response.data` (data returned from MPesa API) in returned messages according to the environment (dev/prod)

## License

[MIT License](LICENSE) &copy; 2020 Ivan Ruby
