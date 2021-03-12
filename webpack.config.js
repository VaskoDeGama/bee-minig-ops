'use strict'

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const frontend = require('./webpack/frontend')
const dev = require('./webpack/dev')

const TARGET = process.env.npm_lifecycle_event

module.exports = merge(
  frontend,
  dev,
  TARGET === 'dev'
    ? {
      plugins: [
        new webpack.DefinePlugin({
          'process.env.SPORTBOOK': '""',
          'process.env.DEV_LOCAL': 'true',
          'process.env.npm_package_version': JSON.stringify(process.env.npm_package_version)
        })
      ]
    }
    : {}
)
