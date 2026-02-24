/* eslint-env mocha */
const assert = require('assert')
require('dotenv').config()

const Tx = require('../src/transaction')

/** @test {Transaction#Reversal} */
describe('Reversal', function () {
  let tx
  before(function () {
    tx = new Tx({
      public_key: process.env.PUBLIC_KEY,
      api_key: process.env.API_KEY,
      api_host: process.env.API_HOST,
      origin: process.env.ORIGIN,
      service_provider_code: process.env.SERVICE_PROVIDER_CODE,
      initiator_identifier: process.env.INITIATOR_IDENTIFIER,
      security_credential: process.env.SECURITY_CREDENTIAL
    })
  })

  it('Should not initialize if reversal data object is empty or invalid', function () {
    assert.throws(
      function () {
        tx.reverse()
      },
      Error,
      /Missing or invalid Reversal parameters/
    )

    assert.throws(
      function () {
        tx.reverse({})
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
        tx.reverse({
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
      /Missing or invalid Reversal parameters: Reversal 3rd-party Reference/
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
      /Missing or invalid Reversal parameters: Reversal 3rd-party Reference/
    )
  })

  it('Initiator Identifier: should be present and non-empty', function () {
    let txNoInitiator = new Tx({
      public_key: process.env.PUBLIC_KEY,
      api_key: process.env.API_KEY,
      api_host: process.env.API_HOST,
      origin: process.env.ORIGIN,
      service_provider_code: process.env.SERVICE_PROVIDER_CODE,
      security_credential: process.env.SECURITY_CREDENTIAL
    })
    assert.throws(
      function () {
        txNoInitiator.reverse({
          amount: process.env.TEST_AMOUNT,
          third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE,
          transaction_id: process.env.TEST_TRANSACTION_ID
        })
      },
      Error,
      /Missing or invalid Reversal parameters: Initiator Identifier/
    )
  })

  it('Security Credential: should be present and non-empty', function () {
    let txNoSecurity = new Tx({
      public_key: process.env.PUBLIC_KEY,
      api_key: process.env.API_KEY,
      api_host: process.env.API_HOST,
      origin: process.env.ORIGIN,
      service_provider_code: process.env.SERVICE_PROVIDER_CODE,
      initiator_identifier: process.env.INITIATOR_IDENTIFIER
    })
    assert.throws(
      function () {
        txNoSecurity.reverse({
          amount: process.env.TEST_AMOUNT,
          third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE,
          transaction_id: process.env.TEST_TRANSACTION_ID
        })
      },
      Error,
      /Missing or invalid Reversal parameters: Security credentials/
    )
  })
})
