assert = require('assert');
require('dotenv').config()

module.exports = function(Tx){
    tx = new Tx({
        public_key: process.env.PUBLIC_KEY,
        api_key: process.env.API_KEY,
        api_host: process.env.API_HOST,
        origin: process.env.ORIGIN,
        service_provider_code: process.env.SERVICE_PROVIDER_CODE,
        initiator_identifier: process.env.INITIATOR_IDENTIFIER,
        security_credential: process.env.SECURITY_CREDENTIAL
    })

    /** @test {Transaction#Query} */
    describe('Query', function(){
        it('Should not initialize if query data object is empty', function(){
            assert.throws(function() {
                tx.query({})
            }, Error, /Missing or invalid/)
        })

        it('Reference: should be present and non-empty', function () {
            assert.throws(function() {
                tx.query({                    
                    third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
                })
            }, Error, /Missing or invalid Query parameters: Query Reference/ )

            assert.throws(function() {
                tx.query({    
                    query_reference: '',                
                    third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
                })
            }, Error, /Missing or invalid Query parameters: Query Reference/ )
        });

        it('Third-party reference: should be present and non-empty', function () {
            assert.throws(function() {
                tx.query({                    
                    query_reference: process.env.TEST_THIRD_PARTY_REFERENCE
                })
            }, Error, /Missing or invalid Query parameters: Query 3rd-party Reference/ )

            assert.throws(function() {
                tx.query({    
                    query_reference: process.env.TEST_QUERY_REFERENCE,                
                    third_party_reference: ''
                })
            }, Error, /Missing or invalid Query parameters: Query 3rd-party Reference/ )
        });
    })
    // let transaction_query = {
    //     query_reference: process.env.TEST_QUERY_REFERENCE,
    //     third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
    // }
    // await transaction.query(transaction_query)
    //     .then(function(response){
    //         console.log('Success on Transaction Query')
    //         console.log(response)
    //     })
    //     .catch(function(response){
    //         console.log('Error on Transaction Query')
    //         console.log(response)
    //     })
    // })

}