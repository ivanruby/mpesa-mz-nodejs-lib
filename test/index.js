Tx = require('../src/transaction')

// Loading test suites for individual Tx features
config_tests = require('./config.test');
c2b_tests = require('./c2b.test');
query_tests = require('./query.test')
reversal_tests = require('./reversal.test')

/** @test {Transaction} */
describe('Transaction', function () {
    config_tests(Tx)
    c2b_tests(Tx)
    query_tests(Tx)
    reversal_tests(Tx)
});