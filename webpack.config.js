var path = require('path');
var webpack = require('webpack');
var dotenv = require('dotenv')

dotenv.config()

var DATA_ROOT_URL = process.env.DATA_ROOT_URL
if(!DATA_ROOT_URL) {
  throw new Error('Environment variable \'DATA_ROOT_URL\' needs to be set')
}

module.exports = {
  entry: {
    'client_bundle':
      ['./public/javascripts/render_viewer.js'],
    'homepage':
      ['./public/javascripts/homepage.js'],
  },
  output: {
    path: path.join(__dirname, 'public/dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": "production"
      },
      'process.env.DATA_ROOT_URL': JSON.stringify(DATA_ROOT_URL),
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.json$/, loader: "json-loader"
      },
      {
        test: /\.jade$/, loader: "jade-loader"
      }
    ]
  }
};
