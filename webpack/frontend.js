'use strict'

const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './client/server.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve('dist')
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              esModule: false
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'client/assets/static', to: 'static' }
      ]
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      templateContent: `<!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="utf-8">
                    <link rel="shortcut icon" href="./static/favicon.png">
                    <title>Mining ops tool</title>
                  </head>
                  <body>
                    <div id="app"></div>
                  </body>
                </html>`
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
