assert = require('assert');
require('dotenv').config()

module.exports = function(Tx){
    describe('Config', function () {
        it('Should not initialize if config object is incomplete or non-valid', function(){
            assert.throws(function(){
                tx = new Tx()
            }, Error, /Missing or invalid configuration parameters/)

            assert.throws(function(){
                tx = new Tx({})
            }, Error, /Missing or invalid configuration parameters/)
        })

        it('API Host: should be present and non-empty', function () {
            assert.throws(function() {
                tx = new Tx({
                    public_key: process.env.PUBLIC_KEY,
                    api_key: process.env.API_KEY,
                    origin: process.env.ORIGIN,
                    service_provider_code: process.env.SERVICE_PROVIDER_CODE,
                    initiator_identifier: process.env.INITIATOR_IDENTIFIER,
                    security_credential: process.env.SECURITY_CREDENTIAL
                })
            }, Error, /Missing or invalid configuration parameters:  API Host/ )
        });

        it('API Key: should be present and non-empty', function () {
            assert.throws(function() {
                tx = new Tx({
                    public_key: process.env.PUBLIC_KEY,
                    api_host: process.env.API_HOST,
                    origin: process.env.ORIGIN,
                    service_provider_code: process.env.SERVICE_PROVIDER_CODE,
                    initiator_identifier: process.env.INITIATOR_IDENTIFIER,
                    security_credential: process.env.SECURITY_CREDENTIAL
                })
            }, Error, /Missing or invalid configuration parameters:  API Key/ ) 
        });

        it('Public Key: should be present and non-empty', function () {
            assert.throws(function() {
                tx = new Tx({
                    api_host: process.env.API_HOST,
                    api_key: process.env.API_KEY,
                    origin: process.env.ORIGIN,
                    service_provider_code: process.env.SERVICE_PROVIDER_CODE,
                    initiator_identifier: process.env.INITIATOR_IDENTIFIER,
                    security_credential: process.env.SECURITY_CREDENTIAL
                })
            }, Error, /Missing or invalid configuration parameters:  Public Key/ ) 
        });

        it('Origin: should be present and non-empty', function () {
            assert.throws(function() {
                tx = new Tx({
                    public_key: process.env.PUBLIC_KEY,
                    api_host: process.env.API_HOST,
                    api_key: process.env.API_KEY,
                    service_provider_code: process.env.SERVICE_PROVIDER_CODE,
                    initiator_identifier: process.env.INITIATOR_IDENTIFIER,
                    security_credential: process.env.SECURITY_CREDENTIAL
                })
            }, Error, /Missing or invalid configuration parameters:  Origin/ ) 
        });

        it('Service Provider Code: should be present and non-empty', function () {
            assert.throws(function() {
                tx = new Tx({
                    public_key: process.env.PUBLIC_KEY,
                    api_host: process.env.API_HOST,
                    api_key: process.env.API_KEY,
                    origin: process.env.ORIGIN,
                    initiator_identifier: process.env.INITIATOR_IDENTIFIER,
                    security_credential: process.env.SECURITY_CREDENTIAL
                })
            }, Error, /Missing or invalid configuration parameters:  Service Provider Code/ ) 
        });

        it('Initiator Identifier: should be present and non-empty', function () {
            assert.throws(function() {
                tx = new Tx({
                    public_key: process.env.PUBLIC_KEY,
                    api_host: process.env.API_HOST,
                    api_key: process.env.API_KEY,
                    origin: process.env.ORIGIN,
                    service_provider_code: process.env.SERVICE_PROVIDER_CODE,
                    security_credential: process.env.SECURITY_CREDENTIAL
                })
            }, Error, /Missing or invalid configuration parameters:  Initiator Identifier/ )
        });

        it('Security Credential: should be present and non-empty', function () {
            assert.throws(function() {
                tx = new Tx({
                    public_key: process.env.PUBLIC_KEY,
                    api_host: process.env.API_HOST,
                    api_key: process.env.API_KEY,
                    origin: process.env.ORIGIN,
                    service_provider_code: process.env.SERVICE_PROVIDER_CODE,
                    initiator_identifier: process.env.INITIATOR_IDENTIFIER
                })
            }, Error, /Missing or invalid configuration parameters:  Security Credential/ )
        });
    });
}