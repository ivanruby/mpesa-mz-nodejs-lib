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
  
    /**
   * Generates a Bearer Token
   * @return {string} bearer_token
   */
  this._getBearerToken = function () {
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
  };

  /**
   * Hold the headers for each API request
   */
  this._request_headers = {
    "Content-Type": "application/json",
    Origin: this._origin,
    Authorization: this._getBearerToken(),
  };

  this._config_errors = [];

  this._withValidConfig = function(){
    this._config_errors = [];

    if (!this._api_host || this._api_host === '')
      this._config_errors.push("API Host ")
    
    if (!this._api_key || this._api_key === '')
      this._config_errors.push("API Key ")

    if (!this._initiator_identifier || this._initiator_identifier === '')
      this._config_errors.push("Initiator Identifier ")
    
    if (!this._origin || this._origin === '')
      this._config_errors.push("Origin ")
    
    if (!this._public_key || this._public_key === '')
      this._config_errors.push("Public key ")
    
    if (!this._security_credential || this._security_credential === '')
      this._config_errors.push('Security credentials ')
    
    if (!this._service_provider_code || this._service_provider_code === '')
      this._config_errors.push('Service provider code ')
    
    if (this._config_errors.length > 0)
      return false
    else
      return true
  }

  /**
   * Initiates a C2B transaction on the M-Pesa API.
   * @param {float} $amount
   * @param {string} $msisdn
   * @param {string} $reference
   * @param {string} $third_party_reference
   * @return {object} Promise
   */
  this.c2b = async function (transaction_data) {

    if (this._withValidConfig()){
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
      throw Error("Missing or invalid configuration parameters: " + this._config_errors.toString())
    }
  },
    /**
     * Initiates a transaction Query on the M-Pesa API.
     * @param {string} query_reference
     * @param {string} third_party_reference
     * @return {object} Promise
     */
    this.query  = async function (query_data) {
      if (this._withValidConfig()){
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
        throw Error("Missing or invalid configuration parameters: " + this._config_errors.toString())
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
    if (this._withValidConfig()) {
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
      throw Error("Missing or invalid configuration parameters: " + this._config_errors.toString())
    }  
  };
}