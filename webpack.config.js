const path = require('path');

module.exports = {
  entry: './src/transaction.js',
  output: {
    filename: 'mpesa.mz.nodejs.lib.js',
    path: path.resolve(__dirname, 'dist'),
  },
};