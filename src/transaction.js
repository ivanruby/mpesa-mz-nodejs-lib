/*!
 * A Node.JS library for the M-Pesa Mozambique API
 *
 * @author Ivan Ruby <https://ivanruby.com>
 * @license MIT
 */

axios = require('axios');
NodeRSA = require('node-rsa');

/**
 * MPesa Transaction class
 * @constructor
 * @param {object} options
 * @return Transaction
 */
module.exports = function (options) {
	/**
   * Configuration variables
   * 
   **/ 
	this._public_key = options.public_key || '',
	this._api_host = options.api_host || '',
	this._api_key = options.api_key || '',
	this._origin = options.origin || '',
	this._service_provider_code = options.service_provider_code || '',
	this._initiator_identifier = options.initiator_identifier || '',
	this._security_credential = options.security_credential || '',
  
	/**
   * MSISDN Validation
   */
	this._validMSISDN;

	/**
   * Validates a customer's MSISDN (Phone number)
   * @param {string} msisdn
   * @return {boolean} isValid
   */
	this._isValidMSISDN = function(msisdn){
		this._validMSISDN = '';
		isValid = false;

		// Is it a number?
		if (typeof parseInt(msisdn) == 'number'){
			// Is the length 12 and starts with 258?
			if ( msisdn.length == 12 && msisdn.substring(0, 3) == '258' ) {
				buffer = msisdn.substring(3,5);
				// Is it an 84 or 85 number?
				if (buffer == '84' || buffer == '85') {
					this._validMSISDN = msisdn;
					isValid = true;
				}
				// Otherwise, is the length 9?
			} else if (msisdn.length == 9) {
				buffer = msisdn.substring(0,2);
				// Is it an 84 or 85 number?
				if (buffer == '84' || buffer == '85') {
					this._validMSISDN = '258' + msisdn;
					isValid = true;
				}        
			}
		}

		return isValid;
	};

	/**
   * Validation buffer
   */
	this.validation_errors;

	/**
   * Validates all configuration parameters
   * @param {string} type
   * @param {object} data
   * @return {boolean}
   */
	this._isValidated = function(type, data){
		this.validation_errors = [];

		switch(type){
		case 'config':
			if (!this._api_host || this._api_host === '')
				this.validation_errors.push(' API Host');
        
			if (!this._api_key || this._api_key === '')
				this.validation_errors.push(' API Key');

			if (!this._initiator_identifier || this._initiator_identifier === '')
				this.validation_errors.push(' Initiator Identifier');
        
			if (!this._origin || this._origin === '')
				this.validation_errors.push(' Origin');
        
			if (!this._public_key || this._public_key === '')
				this.validation_errors.push(' Public key');
        
			if (!this._security_credential || this._security_credential === '')
				this.validation_errors.push(' Security credentials');
        
			if (!this._service_provider_code || this._service_provider_code === '')
				this.validation_errors.push(' Service provider code ');
			break;
		case 'c2b':
			if ( !data.amount || data.amount === '' || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0)
				this.validation_errors.push(' C2B Amount');
        
			if ( !data.msisdn || data.msisdn === '' || !this._isValidMSISDN(data.msisdn) )
				this.validation_errors.push(' C2B MSISDN');
        
			if ( !data.reference || data.reference === '' )
				this.validation_errors.push(' C2B Reference');
        
			if ( !data.third_party_reference || data.third_party_reference === '' )
				this.validation_errors.push(' C2B 3rd-party Reference');
        
			break;
		case 'query':
			if ( !data.query_reference || data.query_reference === '' )
				this.validation_errors.push(' Query Reference');
        
			if ( !data.third_party_reference || data.third_party_reference === '' )
				this.validation_errors.push(' Query 3rd-party Reference');
        
			break;
		case 'reversal':
			if ( !data.amount || data.amount === '' || !isNaN(parseFloat(data.amount)) )
				this.validation_errors.push(' Reversal Amount');
        
			if ( !data.transaction_id || data.transaction_id === '' )
				this.validation_errors.push(' Reversal Transaction ID');
          
			if ( !data.third_party_reference || data.third_party_reference === '' )
				this.validation_errors.push(' Reversal 3rd-party Reference');
		}
    
		if (this.validation_errors.length > 0)
			return false;
    
		return true;
	};

	/**
   * Generates a Bearer Token
   * @return {string} bearer_token
   */
	this._getBearerToken = function () {
		if (this._isValidated('config', {})) {
			// Structuring certificate string
			certificate =
        '-----BEGIN PUBLIC KEY-----\n' +
        this._public_key +
        '\n-----END PUBLIC KEY-----';

			// Create NodeRSA object with public from formatted certificate
			public_key = new NodeRSA();
			public_key.setOptions({ encryptionScheme: 'pkcs1' });
			public_key.importKey(Buffer.from(certificate), 'public');

			// Encryt API key (data) using public key
			token = public_key.encrypt(Buffer.from(this._api_key));

			// Return formatted string, Bearer token in base64 format
			return 'Bearer ' + Buffer.from(token).toString('base64');
		} else {
			throw Error('Missing or invalid configuration parameters:' + this.validation_errors.toString());
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
	this.c2b = function (transaction_data) {

		if (this._isValidated('c2b', transaction_data)){
			request = {
				method: 'post',
				url:
          'https://' + this._api_host + ':18352/ipg/v1x/c2bPayment/singleStage/',
				data: {
					input_ServiceProviderCode: this._service_provider_code,
					input_CustomerMSISDN: this._validMSISDN,
					input_Amount: parseFloat(transaction_data.amount).toFixed(2),
					input_TransactionReference: transaction_data.reference,
					input_ThirdPartyReference: transaction_data.third_party_reference,
				},
				headers: this._request_headers,
			};

			return new Promise(function (resolve, reject) {
				axios(request)
					.then(function (response) {
						console.log('Success');
						resolve(response.data);
					})
					.catch(function (error) {
						console.log('Fail');
						reject(error.response.data);
					});
			});
		} else {
			throw Error('Missing or invalid C2B parameters:' + this.validation_errors.toString());
		}
	};
  
	/**
   * Initiates a transaction Query on the M-Pesa API.
   * @param {string} query_reference
   * @param {string} third_party_reference
   * @return {object} Promise
   */
	this.query = function (query_data) {
		if (this._isValidated('query', query_data)){
			request = {
				method: 'get',
				url:
          'https://' +
          this._api_host +
          ':18353/ipg/v1x/queryTransactionStatus/?input_QueryReference=' +
          query_data.query_reference +
          '&input_ServiceProviderCode=' +
          this._service_provider_code +
          '&input_ThirdPartyReference=' +
          query_data.third_party_reference,
				headers: this._request_headers,
			};

			// If all transaction properties exist and are valid, return promise
			return new Promise(function (resolve, reject) {
				axios(request)
					.then(function (response) {
						console.log('Success');
						resolve(response.data);
					})
					.catch(function (error) {
						console.log('Fail');
						reject(error.response.data);
					});
			});
		} else {
			throw Error('Missing or invalid Query parameters:' + this.validation_errors.toString());
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
					input_SecurityCredential: this._security_credential,
				},
				headers: this.request_headers,
			};

			return new Promise(function (resolve, reject) {
				axios(request)
					.then(function (response) {
						console.log('Success');
						resolve(response.data);
					})
					.catch(function (error) {
						console.log('Fail');
						reject(error.response.data);
					});
			});
		} else {
			throw Error('Missing or invalid Reversal parameters:' + this.validation_errors.toString());
		}  
	};

	/**
   * Validate config data and throw Errors if any is incomplete or invalid
   */
	if (this._isValidated('config', {}))
		this._request_headers = {      
			'Content-Type': 'application/json',
			Origin: this._origin,
			Authorization: this._getBearerToken(),
		};
	else
		throw Error('Missing or invalid configuration parameters:' + this.validation_errors.toString());
};