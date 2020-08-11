/*!
 * A Node.JS library for the M-Pesa Mozambique API
 *
 * @author Ivan Ruby <https://ivanruby.com>
 * @license MIT
 */

axios = require("axios");
NodeRSA = require("node-rsa");

/**
 * MPesa Transaction class
 * @constructor 
 */
module.exports = function (options) {
  // Configuration variables
  this._public_key = options.public_key,
  this._api_host = options.api_host,
  this._api_key = options.api_key,
  this._origin = options.origin,
  this._service_provider_code = options.service_provider_code,
  this._initiator_identifier = options.initiator_identifier,
  this._security_credential = options.security_credential,
  
  this._validation_errors = [];
  /**
   * Validates all configuration parameters
   * @param {string} type
   * @param {object} data
   * @return {boolean}
   */
  this._isValidated = function(type, data){
    this._validation_errors = [];

    switch(type){
      case 'config':
        if (!this._api_host || this._api_host === '')
          this._validation_errors.push("API Host ")
        
        if (!this._api_key || this._api_key === '')
          this._validation_errors.push("API Key ")

        if (!this._initiator_identifier || this._initiator_identifier === '')
          this._validation_errors.push("Initiator Identifier ")
        
        if (!this._origin || this._origin === '')
          this._validation_errors.push("Origin ")
        
        if (!this._public_key || this._public_key === '')
          this._validation_errors.push("Public key ")
        
        if (!this._security_credential || this._security_credential === '')
          this._validation_errors.push('Security credentials ')
        
        if (!this._service_provider_code || this._service_provider_code === '')
          this._validation_errors.push('Service provider code ')
        break;
      case 'c2b':
        if ( !data.amount || data.amount === '' || !isNumber(parseFloat(data.amount)) )
          this._validation_errors.push("C2B Amount ")
        
        if ( !data.msisdn || data.msisdn === '' || !isValidMSISDN(data.msisdn) )
          this._validation_errors.push("C2B MSISDN ")
        
        if ( !data.reference || data.reference === '' )
          this._validation_errors.push("C2B Reference ")
        
        if ( !data.third_party_reference || data.third_party_reference === '' )
          this._validation_errors.push("C2B 3rd-party Reference ")
        
        break;
      case 'query':
        if ( !data.query_reference || data.query_reference === '' )
          this._validation_errors.push("Query Reference ")
        
        if ( !data.third_party_reference || data.third_party_reference === '' )
          this._validation_errors.push("Query 3rd-party Reference ")
        
        break;
      case 'reversal':
        if ( !data.amount || data.amount === '' || !isNumber(parseFloat(data.amount)) )
          this._validation_errors.push("C2B Amount ")
        
        if ( !data.transaction_id || data.transaction_id === '' )
          this._validation_errors.push("C2B Amount ")
          
        if ( !data.third_party_reference || data.third_party_reference === '' )
          this._validation_errors.push("C2B 3rd-party Reference ")
    }
    
    if (this._validation_errors.length > 0)
      return false
    
    return true
  }

  /**
   * Generates a Bearer Token
   * @return {string} bearer_token
   */
  this._getBearerToken = function () {
    if (this._isValidated('config', {})) {
      // Structuring certificate string
      certificate =
        "-----BEGIN PUBLIC KEY-----\n" +
        this._public_key +
        "\n-----END PUBLIC KEY-----";

      // Create NodeRSA object with public from formatted certificate
      public_key = new NodeRSA();
      public_key.setOptions({ encryptionScheme: "pkcs1" });
      public_key.importKey(Buffer.from(certificate), "public");

      // Encryt API key (data) using public key
      token = public_key.encrypt(Buffer.from(this._api_key));

      // Return formatted string, Bearer token in base64 format
      return "Bearer " + Buffer.from(token).toString("base64");
    } else {
      throw Error("Missing or invalid configuration parameters: " + this._validation_errors.toString())
    }
  };

  /**
   * Hold the headers for each API request
   */
  this._request_headers = {};

  /**
   * Initiates a C2B transaction on the M-Pesa API.
   * @param {float} $amount
   * @param {string} $msisdn
   * @param {string} $reference
   * @param {string} $third_party_reference
   * @return {object} Promise
   */
  this.c2b = async function (transaction_data) {

    if (this._isValidated('c2b', transaction_data)){
      request = {
        method: "post",
        url:
          "https://" + this._api_host + ":18352/ipg/v1x/c2bPayment/singleStage/",
        data: {
          input_ServiceProviderCode: this._service_provider_code,
          input_CustomerMSISDN: transaction_data.msisdn,
          input_Amount: parseFloat(transaction_data.amount).toFixed(2),
          input_TransactionReference: transaction_data.reference,
          input_ThirdPartyReference: transaction_data.third_party_reference,
        },
        headers: this._request_headers,
      };

      return await new Promise(function (resolve, reject) {
        axios(request)
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    } else {
      throw Error("Missing or invalid configuration parameters: " + this._validation_errors.toString())
    }
  },
    /**
     * Initiates a transaction Query on the M-Pesa API.
     * @param {string} query_reference
     * @param {string} third_party_reference
     * @return {object} Promise
     */
    this.query  = async function (query_data) {
      if (this._isValidated('query', query_data)){
        request = {
          method: "get",
          url:
            "https://" +
            this._api_host +
            ":18353/ipg/v1x/queryTransactionStatus/?input_QueryReference=" +
            query_data.query_reference +
            "&input_ServiceProviderCode=" +
            this._service_provider_code +
            "&input_ThirdPartyReference=" +
            query_data.third_party_reference,
          headers: this._request_headers,
        };

        // If all transaction properties exist and are valid, return promise
        return await new Promise(function (resolve, reject) {
          axios(request)
            .then(function (response) {
              resolve(response.data);
            })
            .catch(function (error) {
              reject(error.data);
            });
        });
      } else {
        throw Error("Missing or invalid configuration parameters: " + this._validation_errors.toString())
      }
    };

  /**
   * Initiates a transaction Query on the M-Pesa API.
   * @param {number} amount
   * @param {string} transaction_id
   * @param {string} third_party_reference
   * @return {object} Promise
   */
  this.reverse = function (transaction_data) {
    if (this._isValidated('reversal', transaction_data)) {
      request = {
        method: "put",
        url: "https://" + this._api_host + ":18354/ipg/v1x/reversal/",
        data: {
          input_ReversalAmount: Number.parseFloat(
            transaction_data.amount
          ).toFixed(2),
          input_TransactionID: transaction_data.transaction_id,
          input_ThirdPartyReference: transaction_data.third_party_reference,
          input_ServiceProviderCode: this._service_provider_code,
          input_InitiatorIdentifier: this._initiator_identifier,
          input_SecurityCredential: this._security_credential,
        },
        headers: this.request_headers,
      };

      return new Promise(function (resolve, reject) {
        axios(request)
          .then(function (response) {
            resolve(response.data);
          })
          .catch(function (error) {
            reject(error.data);
          });
      });
    } else {
      throw Error("Missing or invalid configuration parameters: " + this._validation_errors.toString())
    }  
  };

  if (this._isValidated('config', {}))
    this._request_headers = {      
      "Content-Type": "application/json",
      Origin: this._origin,
      Authorization: this._getBearerToken(),
    }
  else
    throw Error("Missing or invalid configuration parameters: " + this._validation_errors.toString())
}