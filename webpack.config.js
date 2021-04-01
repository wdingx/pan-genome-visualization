var path = require('path');
var webpack = require('webpack');

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
      }
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
