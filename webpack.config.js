'use strict'

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const frontend = require('./webpack/frontend')
const dev = require('./webpack/dev')

module.exports = merge(
  frontend,
  dev
)
