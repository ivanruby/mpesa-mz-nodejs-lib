const wordwrap = require('word-wrap')
const NodeRSA = require('node-rsa')

module.exports = {
    isValidMSISDN: function(msisdn){
        let msisdn_length = msisdn.toString().length

        // Is it 84XXXXXXX or 25884XXXXXXX
        return msisdn_length == 9 || msisdn_length == 12 
    },

    normalizeMSISDN: function(msisdn){
        return ''
    },
    
    wordwrap: wordwrap,

    NodeRSA: NodeRSA
}