/* eslint-env mocha */
assert = require('assert')
require('dotenv').config()

module.exports = function (Tx) {
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
  /** @test {Transaction#B2C} */
  describe('B2C', function () {
    it('Should not initialize if transaction data object is incomplete or invalid', function () {
      assert.throws(
        function () {
          tx.b2c({})
        },
        Error,
        /Missing or invalid configuration parameters/
      )
    })

    describe('Amount', function () {
      it('Should be present', function () {
        assert.throws(
          function () {
            tx.b2c({
              msisdn: process.env.TEST_MSISDN,
              reference: process.env.TEST_REFERENCE,
              third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
            })
          },
          Error,
          /Missing or invalid configuration parameters: {2}B2C Amount/
        )
      })

      it('Should be a valid number', function () {
        assert.throws(
          function () {
            tx.b2c({
              amount: 'a1.5',
              msisdn: process.env.TEST_MSISDN,
              reference: process.env.TEST_REFERENCE,
              third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
            })
          },
          Error,
          /Missing or invalid configuration parameters: {2}B2C Amount/
        )
      })

      it('Should be greater than zero', function () {
        assert.throws(
          function () {
            tx.b2c({
              amount: '-1',
              msisdn: process.env.TEST_MSISDN,
              reference: process.env.TEST_REFERENCE,
              third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
            })
          },
          Error,
          /Missing or invalid configuration parameters: B2C Amount/
        )
      })
    })

    it('MSISDN: should be present and a valid 9 or 12 digits number', function () {
      assert.throws(
        function () {
          tx.b2c({
            amount: process.env.TEST_AMOUNT,
            reference: process.env.TEST_REFERENCE,
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
          })
        },
        Error,
        /Missing or invalid configuration parameters: B2C MSISDN/
      )

      assert.throws(
        function () {
          tx.b2c({
            amount: process.env.TEST_AMOUNT,
            msisdn: '0841234567',
            reference: process.env.TEST_REFERENCE,
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
          })
        },
        Error,
        /Missing or invalid configuration parameters: B2C MSISDN/
      )

      assert.throws(
        function () {
          tx.b2c({
            amount: process.env.TEST_AMOUNT,
            msisdn: '0258841234567',
            reference: process.env.TEST_REFERENCE,
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
          })
        },
        Error,
        /Missing or invalid configuration parameters: B2C MSISDN/
      )
    })

    it('Reference: should not be empty', function () {
      assert.throws(
        function () {
          tx.b2c({
            amount: process.env.TEST_AMOUNT,
            msisdn: '841234567',
            third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
          })
        },
        Error,
        /Missing or invalid configuration parameters: B2C Reference/
      )
    })

    it('Third-party reference: should not be empty', function () {
      assert.throws(
        function () {
          tx.b2c({
            amount: process.env.TEST_AMOUNT,
            msisdn: '841234567'
          })
        },
        Error,
        /Missing or invalid configuration parameters: B2C 3rd-Party reference/
      )
    })
  })
}
