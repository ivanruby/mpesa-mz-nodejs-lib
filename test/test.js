assert = require('assert');
require('dotenv').config()
Tx = require('../src/transaction')
config_tests = require('./config_test');
c2b_tests = require('./c2b_test');

describe('Transaction', function () {
    config_tests()
    c2b_tests()
});