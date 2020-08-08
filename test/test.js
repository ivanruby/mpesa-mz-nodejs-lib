var assert = require('assert');
const { isNumber } = require('util');
Transaction = require('../src/transaction')
require('dotenv').config()

describe('Transaction', function () {

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

    describe('Config', function () {
        it('API Host: should return an initialized value', function () {
            assert.notEqual(transaction._api_host, undefined)
            assert.notEqual(transaction._api_host, '') 
        });

        it('API Key: should return an initialized value', function () {
            assert.notEqual(transaction._api_key, undefined) 
            assert.notEqual(transaction._api_key, '') 
        });

        it('Public Key: should return an initialized value', function () {
            assert.notEqual(transaction._public_key, undefined)
            assert.notEqual(transaction._public_key, '') 
        });

        it('Origin: should return an initialized value', function () {
            assert.notEqual(transaction._origin, undefined)
            assert.notEqual(transaction._origin, '') 
        });

        it('Service Provider Code: should return an initialized value', function () {
            assert.notEqual(transaction._service_provider_code, undefined) 
            assert.notEqual(transaction._service_provider_code, '') 
        });

        it('Initiator Identifier: should return an initialized value', function () {
            assert.notEqual(transaction._initiator_identifier, undefined)
            assert.notEqual(transaction._initiator_identifier, '') 
        });

        it('Security Credential: should return an initialized value', function () {
            assert.notEqual(transaction._security_credential, undefined)
            assert.notEqual(transaction._security_credential, '')
        });
    });  
    
    describe('C2B', function(){
        let purchase = {
            amount: process.env.TEST_AMOUNT,
            msisdn: process.env.TEST_MSISDN,
            reference: process.env.TEST_REFERENCE,
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
        }

        it('Amount: should be a number', function(){
            assert(isNumber(parseFloat(purchase.amount)))
        })

        it('MSISDN: should be a valid 9 or 12 digits number', function(){
            if (purchase.msisdn.length == 12 && purchase.msisdn.substring(0, 3) == '258') {
                buffer = purchase.msisdn.substring(3,5)
                assert(buffer == '84' || buffer == '85' || buffer == '86')
            } else if (purchase.msisdn.length == 9) {
                buffer = purchase.msisdn.substring(0,2)
                assert(buffer == '84' || buffer == '85' || buffer == '86')
            } else {
                assert.ok(false)
            }
        })

        it('Reference: should not be empty', function(){
            assert.notEqual(purchase.reference, undefined)
            assert.notEqual(purchase.reference, '')
        })

        it('Third-party reference: should not be empty', function(){
            assert.notEqual(purchase.third_party_reference, undefined)
            assert.notEqual(purchase.third_party_reference, '')
        })
    })
});