/* eslint-env mocha */
assert = require('assert')
require('dotenv').config()

module.exports = function (Tx) {
  tx = new Tx({
    public_key: process.env.PUBLIC_KEY,
    api_key: process.env.API_KEY,
    api_host: process.env.API_HOST,
    origin: process.env.ORIGIN,
    service_provider_code: process.env.SERVICE_PROVIDER_CODE,
    initiator_identifier: process.env.INITIATOR_IDENTIFIER,
    security_credential: process.env.SECURITY_CREDENTIAL
  })

  /** @test {Transaction#Reversal} */
  describe('Reversal', function () {
    it('Should not initialize if reversal data object is empty or invalid', function () {
      assert.throws(
        function () {
          tx.reversal()
        },
        Error,
        /Missing or invalid Reversal parameters/
      )

      assert.throws(
        function () {
          tx.reversal({})
        },
        Error,
        /Missing or invalid Reversal parameters/
      )
    })

    it('Amount: should be present, non-empty and greater than zero', function () {
      assert.throws(
        function () {
          tx.reverse({
            transaction_id: process.env.TEST_TRANSACTION_ID,
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
          })
        },
        Error,
        /Missing or invalid Reversal parameters: Reversal Amount/
      )

      assert.throws(
        function () {
          tx.reverse({
            amount: '',
            transaction_id: process.env.TEST_TRANSACTION_ID,
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
          })
        },
        Error,
        /Missing or invalid Reversal parameters: Reversal Amount/
      )

      assert.throws(
        function () {
          tx.reverse({
            amount: '-1',
            transaction_id: process.env.TEST_TRANSACTION_ID,
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
          })
        },
        Error,
        /Missing or invalid Reversal parameters: Reversal Amount/
      )
    })

    it('Transaction ID: should be present and non-empty', function () {
      assert.throws(
        function () {
          tx.reverse({
            amount: process.env.TEST_AMOUNT,
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
          })
        },
        Error,
        /Missing or invalid Reversal parameters: Reversal Transaction ID/
      )

      assert.throws(
        function () {
          tx.reversal({
            amount: '1',
            transaction_id: '',
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
          })
        },
        Error,
        /Missing or invalid Reversal parameters: Reversal Transaction ID/
      )
    })

    it('Third party reference: should be present and non-empty', function () {
      assert.throws(
        function () {
          tx.reverse({
            amount: process.env.TEST_AMOUNT,
            transaction_id: process.env.TEST_TRANSACTION_ID
          })
        },
        Error,
        /Missing or invalid Reversal parameters: Reversal 3rd-Party Reference/
      )

      assert.throws(
        function () {
          tx.reverse({
            amount: '',
            transaction_id: process.env.TEST_TRANSACTION_ID,
            third_party_reference: ''
          })
        },
        Error,
        /Missing or invalid Reversal parameters: Reversal 3rd-Party Reference/
      )
    })

    it('Initiator Identifier: should be present and non-empty', function () {
      assert.throws(
        function () {
          tx.reversal({
            amount: process.env.TEST_AMOUNT,
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE,
            transaction_id: process.env.TEST_TRANSACTION_ID,
            security_credential: process.env.SECURITY_CREDENTIAL,
            service_provider_code: process.env.SERVICE_PROVIDER_CODE
          })
        },
        Error,
        /Missing or invalid configuration parameters: Initiator Identifier/
      )
    })

    it('Security Credential: should be present and non-empty', function () {
      assert.throws(
        function () {
          tx.reversal({
            amount: process.env.TEST_AMOUNT,
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE,
            transaction_id: process.env.TEST_TRANSACTION_ID,
            initiator_identifier: process.env.INITIATOR_IDENTIFIER,
            service_provider_code: process.env.SERVICE_PROVIDER_CODE
          })
        },
        Error,
        /Missing or invalid configuration parameters: Security Credential/
      )
    })

    // let transaction_to_reverse = {
    //     amount: process.env.TEST_AMOUNT,
    //     transaction_id: process.env.TEST_TRANSACTION_ID,
    //     third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
    // }

    // await transaction.reverse(transaction_to_reverse)
    //     .then(function(response){
    //         console.log('Success on Transaction Reversal')
    //         console.log(response)
    //     })
    //     .catch(function(response){
    //         console.log('Error on Transaction Reversal')
    //         console.log(response)
    //     })
    // }
  })
}
