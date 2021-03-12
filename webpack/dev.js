'use strict'

const path = require('path')

module.exports = {
  devServer: {

    contentBase: path.join(__dirname, '../dist/static'),
    clientLogLevel: 'none',
    publicPath: '/',
    compress: false,
    disableHostCheck: true,
    host: 'localhost',
    port: 9011,
    proxy: {
      '/': 'http://localhost:3000/'
    }
  },
  mode: 'development'
}
