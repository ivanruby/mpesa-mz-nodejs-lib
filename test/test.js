Tx = require('../src/transaction')

config_tests = require('./config_test');
c2b_tests = require('./c2b_test');
// query_tests = require('./query_test')
// reversal_tests = require('./reversal_test')

describe('Transaction', function () {
    config_tests(Tx)
    c2b_tests(Tx)
    // query_tests(Tx)
    // reversal_tests(Tx)
});