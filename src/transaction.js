/*!
 * A Node.JS library for the M-Pesa Mozambique API
 *
 * @author Ivan Ruby <https://ivanruby.com>
 * @license MIT
 */

var axios = require('axios')
var NodeRSA = require('node-rsa')

/**
 * Transaction module - Interacts with the M-Pesa API by exposing c2b, query and reverse methods.
 * Throws errors if any of the methods receives incomplete or invalid parameters, including the class constructor
 *
 * @module Transaction
 * @param {object} options
 * @param {string} [options.api_host=api.sandbox.vm.co.mz] - Hostname for the API
 * @param {string} options.api_key=empty-string - Used for creating authorize trasactions on the API
 * @param {string} options.initiator_identifier=empty-string - Provided by Vodacom MZ
 * @param {string} options.origin=empty-string - Used for identifying hostname which is sending transaction requests
 * @param {string} options.public_key=empty-string - Public Key for the M-Pesa API. Used for generating Authorization bearer tokens
 * @param {string} options.security_credential=empty-string - Provided by Vodacom MZ
 * @param {number} options.service_provider_code=empty-string - Provided by Vodacom MZ
 * @throws 'Missing or invalid configuration parameters' Error if options object is incomplete or invalid
 * @example
 * Transaction = require('mpesa-mz-nodejs-lib')
 *  tx = new Transaction(options)
 *
 * @return {Class} Transaction
 */
module.exports = function (options) {
  /** Public key - Required by the M-Pesa API
   * @member _public_key
   * @type {string}
   */
  ;(this._public_key = options.public_key || ''),
    /** API Host - Required by the M-Pesa API
     * @member _api_host
     * @type {string}
     */
    (this._api_host = options.api_host || 'api.sandbox.vm.co.mz'),
    /** API key - Required by the M-Pesa API
     * @member _api_key
     * @type {string}
     */
    (this._api_key = options.api_key || ''),
    /** Origin - Required by the M-Pesa API
     * @member _origin
     * @type {string}
     */
    (this._origin = options.origin || ''),
    /** Service Provider Code - Required by the M-Pesa API
     * @member _service_provider_code
     * @type {number}
     */
    (this._service_provider_code = options.service_provider_code || ''),
    /** Initiator Identifier - Required by the M-Pesa API
     * @member _initiator_identifier
     * @type {string}
     */
    (this._initiator_identifier = options.initiator_identifier || ''),
    /** Security Credential - Required by the M-Pesa API
     * @member _security_credential
     * @type {string}
     */
    (this._security_credential = options.security_credential || ''),
    /**
     * MSISDN Validation
     * @member _validMSISDN - Holds a validated phone number
     */
    this._validMSISDN

  /**
   * Validates a customer's MSISDN (Phone number)
   *
   * @member _isValidMSISDN
   * @function
   * @param {string} msisdn
   * @return {boolean} isValid
   */
  this._isValidMSISDN = function (msisdn) {
    this._validMSISDN = ''
    isValid = false

    // Is it a number?
    if (typeof parseInt(msisdn) === 'number') {
      // Is the length 12 and starts with 258?
      if (msisdn.length === 12 && msisdn.substring(0, 3) === '258') {
        buffer = msisdn.substring(3, 5)
        // Is it an 84 or 85 number?
        if (buffer === '84' || buffer === '85') {
          this._validMSISDN = msisdn
          isValid = true
        }
        // Otherwise, is the length 9?
      } else if (msisdn.length == 9) {
        buffer = msisdn.substring(0, 2)
        // Is it an 84 or 85 number?
        if (buffer === '84' || buffer === '85') {
          this._validMSISDN = '258' + msisdn
          isValid = true
        }
      }
    }

    return isValid
  }

  this._validateAmount = function (amount) {
    return (
      !amount ||
      amount === '' ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0
    )
  }

  /**
   * Validation buffer
   * @member validation_errors - Hold array of errors after error validation
   */
  this.validation_errors

  /**
   * Validates all configuration parameters
   *
   * @member _isValidated
   * @function
   * @param {string} type
   * @param {object} data
   * @return {boolean}
   */
  this._isValidated = function (type, data) {
    this.validation_errors = []

    switch (type) {
      case 'config':
        if (!this._api_host || this._api_host === '') {
          this.validation_errors.push(' API Host')
        }

        if (!this._api_key || this._api_key === '') {
          this.validation_errors.push(' API Key')
        }

        if (
          !this._service_provider_code ||
          this._service_provider_code === ''
        ) {
          this.validation_errors.push(' Service provider code ')
        }

        if (!this._origin || this._origin === '') {
          this.validation_errors.push(' Origin')
        }

        if (!this._public_key || this._public_key === '') {
          this.validation_errors.push(' Public key')
        }
        break
      case 'c2b':
        if (this._validateAmount(data.amount)) {
          this.validation_errors.push(' C2B Amount')
        }

        if (
          !data.msisdn ||
          data.msisdn === '' ||
          !this._isValidMSISDN(data.msisdn)
        ) {
          this.validation_errors.push(' C2B MSISDN')
        }

        if (!data.reference || data.reference === '') {
          this.validation_errors.push(' C2B Reference')
        }

        if (!data.third_party_reference || data.third_party_reference === '') {
          this.validation_errors.push(' C2B 3rd-party Reference')
        }

        break
      case 'query':
        if (!data.query_reference || data.query_reference === '') {
          this.validation_errors.push(' Query Reference')
        }

        if (!data.third_party_reference || data.third_party_reference === '') {
          this.validation_errors.push(' Query 3rd-party Reference')
        }

        break
      case 'reversal':
        if (!this._initiator_identifier || this._initiator_identifier === '') {
          this.validation_errors.push(' Initiator Identifier')
        }

        if (!this._security_credential || this._security_credential === '') {
          this.validation_errors.push(' Security credentials')
        }

        if (this._validateAmount(data.amount)) {
          this.validation_errors.push(' Reversal Amount')
        }

        if (!data.transaction_id || data.transaction_id === '') {
          this.validation_errors.push(' Reversal Transaction ID')
        }

        if (!data.third_party_reference || data.third_party_reference === '') {
          this.validation_errors.push(' Reversal 3rd-party Reference')
        }
    }

    if (this.validation_errors.length > 0) {
      return false
    }

    return true
  }

  /**
   * Generates a Bearer Token
   * @member _getBearerToken
   * @function
   * @throws 'Missing or invalid configuration parameters' Error if _public_key or _api_key are missing or invalid from object instantiation
   *
   * @return {string} bearer_token
   */
  this._getBearerToken = function () {
    if (this._isValidated('config', {})) {
      // Structuring certificate string
      certificate =
        '-----BEGIN PUBLIC KEY-----\n' +
        this._public_key +
        '\n-----END PUBLIC KEY-----'

      // Create NodeRSA object with public from formatted certificate
      public_key = new NodeRSA()
      public_key.setOptions({ encryptionScheme: 'pkcs1' })
      public_key.importKey(Buffer.from(certificate), 'public')

      // Encryt API key (data) using public key
      token = public_key.encrypt(Buffer.from(this._api_key))

      // Return formatted string, Bearer token in base64 format
      return 'Bearer ' + Buffer.from(token).toString('base64')
    } else {
      throw new Error(
        'Missing or invalid configuration parameters:' +
          this.validation_errors.toString()
      )
    }
  }

  /**
   * Holds the request headers for each API request
   * @member _request_headers
   * @function
   * @type {object}
   * @param {string} _origin - origin value from initialization
   * @param {string} _public_key - public_key value from initialization
   * @param {string} _api_key - api_key value from initialization
   * @throws 'Missing or invalid configuration parameters' Error if _api_key, _origin or _public_key are missing or invalid from object instantiation
   */
  this._request_headers = {}

  this._requestAsPromiseFrom = function (request) {
    return new Promise(function (resolve, reject) {
      axios(request)
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject(error.toJSON())
        })
    })
  }

  /**
   * Initiates a C2B (Client-to-Business) transaction on the M-Pesa API.
   *
   * @param {object} transaction_data
   * @param {float}  transaction_data.amount - Value to transfer from Client to Business
   * @param {string} transaction_data.msisdn - Client's phone number
   * @param {string} transaction_data.reference - Transaction reference (unique)
   * @param {string} transaction_data.third_party_reference - Third-party reference provided by Vodacom MZ
   * @throws 'Missing or invalid C2B parameters' Error if params are missing or invalid
   * @example
   * Transaction = require('mpesa-mz-nodejs-lib')
   * // Instantiate Transaction object with valid options params
   * tx = new Transaction(options)
   *
   * tx.c2b({
   * 	amount: 1,
   * 	msisdn: '821234567'
   * 	reference: 'T001',
   * 	third_party_reference: '12345'
   * }).then(function(data){
   * 	console.log(data)
   * }).catch(function(error){
   * 	console.log(error)
   * })
   *
   * @return {object} Promise
   */
  this.c2b = function (transaction_data) {
    if (this._isValidated('c2b', transaction_data)) {
      request = {
        method: 'post',
        url:
          'https://' +
          this._api_host +
          ':18352/ipg/v1x/c2bPayment/singleStage/',
        data: {
          input_ServiceProviderCode: this._service_provider_code,
          input_CustomerMSISDN: this._validMSISDN,
          input_Amount: parseFloat(transaction_data.amount).toFixed(2),
          input_TransactionReference: transaction_data.reference,
          input_ThirdPartyReference: transaction_data.third_party_reference
        },
        headers: this._request_headers
      }

      return this._requestAsPromiseFrom(request)
    } else {
      throw new Error(
        'Missing or invalid C2B parameters:' + this.validation_errors.toString()
      )
    }
  }

  /**
   * Initiates a C2B (Client-to-Business) transaction Query on the M-Pesa API.
   *
   * @param {object} query_data
   * @param {string} query_data.query_reference - TransactionID or ConversationID returned from the M-Pesa API
   * @param {string} query_data.third_party_reference - Unique reference of the third-party system
   * @throws 'Missing or invalid Query parameters' Error is params are missing or invalid
   * @example
   * Transaction = require('mpesa-mz-nodejs-lib')
   * // Instantiate Transaction object with valid params
   * tx = new Transaction(options)
   *
   * tx.query({
   * 	query_reference:'08y844du6gs',
   * 	third_party_reference:'12345'
   * }).then(function(data){
   * 	console.log(data)
   * }).catch(function(error){
   * 	console.log(error)
   * })
   *
   * @return {object} Promise
   */
  this.query = function (query_data) {
    if (this._isValidated('query', query_data)) {
      request = {
        method: 'get',
        url:
          'https://' +
          this._api_host +
          ':18353/ipg/v1x/queryTransactionStatus/?input_ServiceProviderCode=' +
          this._service_provider_code +
          '&input_QueryReference=' +
          query_data.query_reference +
          '&input_ThirdPartyReference=' +
          query_data.third_party_reference,
        headers: this._request_headers
      }

      // If all transaction properties exist and are valid, return promise
      return this._requestAsPromiseFrom(request)
    } else {
      throw new Error(
        'Missing or invalid Query parameters:' +
          this.validation_errors.toString()
      )
    }
  }

  /**
   * Initiates a C2B (Client-to-Business) transaction Reversal on the M-Pesa API
   *
   * @param {object} transaction_data
   * @param {number} [transaction_data.amount] - Amount of the transaction
   * @param {string} transaction_data.transaction_id - TransactionID returned from the M-Pesa API
   * @param {string} transaction_data.third_party_reference - Unique reference of the third-party system
   * @throws 'Missing or invalid Reversal parameters' Error if params are missing or invalid
   * @example
   * Transaction = require('mpesa-mz-nodejs-lib')
   * // Instantiate Transaction object with valid params
   * tx = new Transaction(options)
   *
   * tx.reversal({
   * 	amount:1,
   * 	transaction_id: 'tvfs2503x1d'
   * 	third_party_reference:'12345'
   * }).then(function(data){
   * console.log(data)
   * }).catch(function(error){
   * console.log(error)
   * })
   *
   * @return {object} Promise
   */
  this.reverse = function (transaction_data) {
    if (this._isValidated('reversal', transaction_data)) {
      request = {
        method: 'put',
        url: 'https://' + this._api_host + ':18354/ipg/v1x/reversal/',
        data: {
          input_ReversalAmount: Number.parseFloat(
            transaction_data.amount
          ).toFixed(2),
          input_TransactionID: transaction_data.transaction_id,
          input_ThirdPartyReference: transaction_data.third_party_reference,
          input_ServiceProviderCode: this._service_provider_code,
          input_InitiatorIdentifier: this._initiator_identifier,
          input_SecurityCredential: this._security_credential
        },
        headers: this._request_headers
      }

      return this._requestAsPromiseFrom(request)
    } else {
      throw new Error(
        'Missing or invalid Reversal parameters:' +
          this.validation_errors.toString()
      )
    }
  }

  /**
   * Initiates a B2C (Business-to-Client) transaction on the M-Pesa API
   *
   * @param {object} transaction_data
   * @param {float}  transaction_data.amount - Value to transfer from Business to Client
   * @param {string} transaction_data.msisdn - Client's phone number
   * @param {string} transaction_data.reference - Transaction reference (unique)
   * @param {string} transaction_data.third_party_reference - Third-party reference provided by Vodacom MZ
   * @throws 'Missing or invalid B2C parameters' Error if params are missing or invalid
   * @example
   * Transaction = require('mpesa-mz-nodejs-lib')
   * // Instantiate Transaction object with valid options params
   * tx = new Transaction(options)
   *
   * tx.b2c({
   * 	amount: 1,
   * 	msisdn: '821234567'
   * 	reference: 'T001',
   * 	third_party_reference: '12345'
   * }).then(function(data){
   * 	console.log(data)
   * }).catch(function(error){
   * 	console.log(error)
   * })
   *
   * @return {object} Promise
   */
  this.b2c = function (transaction_data) {
    if (this._isValidated('c2b', transaction_data)) {
      request = {
        method: 'post',
        url: 'https://' + this._api_host + ':18345/ipg/v1x/b2cPayment/',
        data: {
          input_ReversalAmount: Number.parseFloat(
            transaction_data.amount
          ).toFixed(2),
          input_ServiceProviderCode: this._service_provider_code,
          input_CustomerMSISDN: this._validMSISDN,
          input_Amount: parseFloat(transaction_data.amount).toFixed(2),
          input_TransactionReference: transaction_data.reference,
          input_ThirdPartyReference: transaction_data.third_party_reference
        },
        headers: this._request_headers
      }

      return this._requestAsPromiseFrom(request)
    } else {
      throw new Error(
        'Missing or invalid B2C parameters:' + this.validation_errors.toString()
      )
    }
  }

  // Validate config data and throw config errors if any param is missing or invalid
  if (this._isValidated('config', {})) {
    this._request_headers = {
      'Content-Type': 'application/json',
      Origin: this._origin,
      Authorization: this._getBearerToken()
    }
  } else {
    throw new Error(
      'Missing or invalid configuration parameters:' +
        this.validation_errors.toString()
    )
  }
}
