/*!
 * A Node.JS library for the M-Pesa Mozambique API
 *
 * @author Ivan Ruby <https://ivanruby.com>
 * @license MIT
 */
var axios=require("axios"),NodeRSA=require("node-rsa");module.exports=function(e){if(this._public_key=e.public_key||"",this._api_host=e.api_host||"api.sandbox.vm.co.mz",this._api_key=e.api_key||"",this._origin=e.origin||"",this._service_provider_code=e.service_provider_code||"",this._initiator_identifier=e.initiator_identifier||"",this._security_credential=e.security_credential||"",this._validMSISDN,this._isValidMSISDN=function(e){return this._validMSISDN="",isValid=!1,"number"==typeof parseInt(e)&&(12===e.length&&"258"===e.substring(0,3)?(buffer=e.substring(3,5),"84"!==buffer&&"85"!==buffer||(this._validMSISDN=e,isValid=!0)):9==e.length&&(buffer=e.substring(0,2),"84"!==buffer&&"85"!==buffer||(this._validMSISDN="258"+e,isValid=!0))),isValid},this._validateAmount=function(e){return!e||""===e||isNaN(parseFloat(e))||parseFloat(e)<=0},this.validation_errors,this._isValidated=function(e,i){switch(this.validation_errors=[],e){case"config":this._api_host&&""!==this._api_host||this.validation_errors.push(" API Host"),this._api_key&&""!==this._api_key||this.validation_errors.push(" API Key"),this._service_provider_code&&""!==this._service_provider_code||this.validation_errors.push(" Service provider code "),this._origin&&""!==this._origin||this.validation_errors.push(" Origin"),this._public_key&&""!==this._public_key||this.validation_errors.push(" Public key");break;case"c2b":this._validateAmount(i.amount)&&this.validation_errors.push(" C2B Amount"),i.msisdn&&""!==i.msisdn&&this._isValidMSISDN(i.msisdn)||this.validation_errors.push(" C2B MSISDN"),i.reference&&""!==i.reference||this.validation_errors.push(" C2B Reference"),i.third_party_reference&&""!==i.third_party_reference||this.validation_errors.push(" C2B 3rd-party Reference");break;case"query":i.query_reference&&""!==i.query_reference||this.validation_errors.push(" Query Reference"),i.third_party_reference&&""!==i.third_party_reference||this.validation_errors.push(" Query 3rd-party Reference");break;case"reversal":this._initiator_identifier&&""!==this._initiator_identifier||this.validation_errors.push(" Initiator Identifier"),this._security_credential&&""!==this._security_credential||this.validation_errors.push(" Security credentials"),this._validateAmount(i.amount)&&this.validation_errors.push(" Reversal Amount"),i.transaction_id&&""!==i.transaction_id||this.validation_errors.push(" Reversal Transaction ID"),i.third_party_reference&&""!==i.third_party_reference||this.validation_errors.push(" Reversal 3rd-party Reference")}return!(0<this.validation_errors.length)},this._getBearerToken=function(){if(this._isValidated("config",{}))return certificate="-----BEGIN PUBLIC KEY-----\n"+this._public_key+"\n-----END PUBLIC KEY-----",public_key=new NodeRSA,public_key.setOptions({encryptionScheme:"pkcs1"}),public_key.importKey(Buffer.from(certificate),"public"),token=public_key.encrypt(Buffer.from(this._api_key)),"Bearer "+Buffer.from(token).toString("base64");throw new Error("Missing or invalid configuration parameters:"+this.validation_errors.toString())},this._request_headers={},this._requestAsPromiseFrom=function(e){return new Promise(function(i,r){axios(e).then(function(e){i(e.data)}).catch(function(e){r(e.response.data)})})},this.c2b=function(e){if(this._isValidated("c2b",e))return request={method:"post",url:"https://"+this._api_host+":18352/ipg/v1x/c2bPayment/singleStage/",data:{input_ServiceProviderCode:this._service_provider_code,input_CustomerMSISDN:this._validMSISDN,input_Amount:parseFloat(e.amount).toFixed(2),input_TransactionReference:e.reference,input_ThirdPartyReference:e.third_party_reference},headers:this._request_headers},this._requestAsPromiseFrom(request);throw new Error("Missing or invalid C2B parameters:"+this.validation_errors.toString())},this.query=function(e){if(this._isValidated("query",e))return request={method:"get",url:"https://"+this._api_host+":18353/ipg/v1x/queryTransactionStatus/",data:{input_ServiceProviderCode:this._service_provider_code,input_QueryReference:e.query_reference,input_ThirdPartyReference:e.third_party_reference},headers:this._request_headers},this._requestAsPromiseFrom(request);throw new Error("Missing or invalid Query parameters:"+this.validation_errors.toString())},this.reverse=function(e){if(this._isValidated("reversal",e))return request={method:"put",url:"https://"+this._api_host+":18354/ipg/v1x/reversal/",data:{input_ReversalAmount:Number.parseFloat(e.amount).toFixed(2),input_TransactionID:e.transaction_id,input_ThirdPartyReference:e.third_party_reference,input_ServiceProviderCode:this._service_provider_code,input_InitiatorIdentifier:this._initiator_identifier,input_SecurityCredential:this._security_credential},headers:this._request_headers},this._requestAsPromiseFrom(request);throw new Error("Missing or invalid Reversal parameters:"+this.validation_errors.toString())},!this._isValidated("config",{}))throw new Error("Missing or invalid configuration parameters:"+this.validation_errors.toString());this._request_headers={"Content-Type":"application/json",Origin:this._origin,Authorization:this._getBearerToken()}};