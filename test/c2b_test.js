assert = require('assert');
require('dotenv').config()

module.exports = function(Tx) {
    // Initialize transaction object
    tx = Tx({
        public_key: process.env.PUBLIC_KEY,
        api_host: process.env.API_HOST,
        api_key: process.env.API_KEY,
        origin: process.env.ORIGIN,
        service_provider_code: process.env.SERVICE_PROVIDER_CODE,
        initiator_identifier: process.env.INITIATOR_IDENTIFIER,
        security_credential: process.env.SECURITY_CREDENTIAL
    })

    describe('C2B', function(){        
        it('Should not initialize if transaction data object is incomplete or invalid', function(){
            init = function(){
                tx.c2b({})
            }
            assert.throws(init, Error, /Missing or invalid configuration parameters/)
        })

        describe('Amount', function(){
            it('Should be present', function(){
                init = function() {
                    tx.c2b({
                        msisdn: process.env.TEST_MSISDN,
                        reference: process.env.TEST_REFERENCE,
                        third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
                    })
                }
                
                assert.throws(init, Error, /Missing or invalid configuration parameters:  C2B Amount/)
            })
            
            it('Should be a valid number', function(){
                init = function() {
                    tx.c2b({
                        amount: 'a1.5',
                        msisdn: process.env.TEST_MSISDN,
                        reference: process.env.TEST_REFERENCE,
                        third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
                    })
                }
                
                assert.throws(init, Error, /Missing or invalid configuration parameters:  C2B Amount/)
            })

            it('Should be greater than zero', function(){
                init = function() {
                    tx.c2b({
                        amount: '-1',
                        msisdn: process.env.TEST_MSISDN,
                        reference: process.env.TEST_REFERENCE,
                        third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
                    })
                }
                
                assert.throws(init, Error, /Missing or invalid configuration parameters:  C2B Amount/)
            })

        })
        
        it('MSISDN: should be present and a valid 9 or 12 digits number', function(){
            init = function() {
                tx.c2b({
                    amount: process.env.TEST_AMOUNT,
                    msisdn: '841234567',
                    reference: process.env.TEST_REFERENCE,
                    third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
                })
            }
            
            assert.throws(init, Error, /Missing or invalid configuration parameters:  C2B MSISDN/)
        })

        it('Reference: should not be empty', function(){
            init = function() {
                tx.c2b({
                    amount: process.env.TEST_AMOUNT,
                    msisdn: '841234567',
                    third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
                })
            }
            assert.throws(init, Error, /Missing or invalid configuration parameters: C2B Reference/)
        })

        it('Third-party reference: should not be empty', function(){
            init = function() {
                tx.c2b({
                    amount: process.env.TEST_AMOUNT,
                    msisdn: '841234567',
                    third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
                })
            }
            assert.throws(init, Error, /Missing or invalid configuration parameters: C2B 3rd-Party reference/)
        })
    })
}