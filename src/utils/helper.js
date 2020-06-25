module.exports = {
    isValidMSISDN: function(msisdn){
        let msisdn_length = msisdn.toString().length

        // Is it 84XXXXXXX or 25884XXXXXXX
        return msisdn_length == 9 || msisdn_length == 12 
    },

    normalizeMSISDN: function(msisdn){
        return ''
    },
    // Credits to: https://stackoverflow.com/questions/14484787/wrap-text-in-javascript/14502311#14502311
    wordwrap: function (str, width, spaceReplacer) {
        if (str.length>width) {
            var p=width
            for (;p>0 && str[p]!=' ';p--) {
            }
            if (p>0) {
                var left = str.substring(0, p);
                var right = str.substring(p+1);
                return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
            }
        }
        return str;
    }
}