/* eslint-env mocha */
const assert = require('assert')
require('dotenv').config()

const Tx = require('../src/transaction')
let tx

/** @test {Transaction#Config} */
describe('Config', function () {
  it('Should not initialize if config object is incomplete or non-valid', function () {
    assert.throws(
      function () {
        tx = new Tx()
      },
      Error,
      /Missing or invalid configuration parameters/
    )

    assert.throws(
      function () {
        tx = new Tx({})
      },
      Error,
      /Missing or invalid configuration parameters/
    )
  })

  it('API Host: May be present and non-empty - Optional param', function () {
    assert.doesNotThrow(
      function () {
        tx = new Tx({
          public_key: process.env.PUBLIC_KEY,
          api_key: process.env.API_KEY,
          origin: process.env.ORIGIN,
          service_provider_code: process.env.SERVICE_PROVIDER_CODE,
          initiator_identifier: process.env.INITIATOR_IDENTIFIER,
          security_credential: process.env.SECURITY_CREDENTIAL
        })
      },
      Error,
      /Missing or invalid configuration parameters: API Host/
    )

    assert.doesNotThrow(
      function () {
        tx = new Tx({
          public_key: process.env.PUBLIC_KEY,
          api_key: process.env.API_KEY,
          api_host: '',
          origin: process.env.ORIGIN,
          service_provider_code: process.env.SERVICE_PROVIDER_CODE,
          initiator_identifier: process.env.INITIATOR_IDENTIFIER,
          security_credential: process.env.SECURITY_CREDENTIAL
        })
      },
      Error,
      /Missing or invalid configuration parameters: API Host/
    )
  })

  it('API Key: should be present and non-empty', function () {
    assert.throws(
      function () {
        tx = new Tx({
          public_key: process.env.PUBLIC_KEY,
          api_host: process.env.API_HOST,
          origin: process.env.ORIGIN,
          service_provider_code: process.env.SERVICE_PROVIDER_CODE,
          initiator_identifier: process.env.INITIATOR_IDENTIFIER,
          security_credential: process.env.SECURITY_CREDENTIAL
        })
      },
      Error,
      /Missing or invalid configuration parameters: API Key/
    )
  })

  it('Public Key: should be present and non-empty', function () {
    assert.throws(
      function () {
        tx = new Tx({
          api_host: process.env.API_HOST,
          api_key: process.env.API_KEY,
          origin: process.env.ORIGIN,
          service_provider_code: process.env.SERVICE_PROVIDER_CODE,
          initiator_identifier: process.env.INITIATOR_IDENTIFIER,
          security_credential: process.env.SECURITY_CREDENTIAL
        })
      },
      Error,
      /Missing or invalid configuration parameters: Public Key/
    )
  })

  it('Origin: should be present and non-empty', function () {
    assert.throws(
      function () {
        tx = new Tx({
          public_key: process.env.PUBLIC_KEY,
          api_host: process.env.API_HOST,
          api_key: process.env.API_KEY,
          service_provider_code: process.env.SERVICE_PROVIDER_CODE,
          initiator_identifier: process.env.INITIATOR_IDENTIFIER,
          security_credential: process.env.SECURITY_CREDENTIAL
        })
      },
      Error,
      /Missing or invalid configuration parameters: Origin/
    )
  })

  it('Service Provider Code: should be present and non-empty', function () {
    assert.throws(
      function () {
        tx = new Tx({
          public_key: process.env.PUBLIC_KEY,
          api_host: process.env.API_HOST,
          api_key: process.env.API_KEY,
          origin: process.env.ORIGIN,
          initiator_identifier: process.env.INITIATOR_IDENTIFIER,
          security_credential: process.env.SECURITY_CREDENTIAL
        })
      },
      Error,
      /Missing or invalid configuration parameters: Service Provider Code/
    )
  })
})

