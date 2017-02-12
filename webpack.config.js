'use strict';

var path = require("path");
var config = require('./config.js');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpackModule = {
  entry: {
    app: './src/index.js',
    vendor: [
      "angular",
      "angular-route",
      "angular-nvd3",
    ]
  },
  output: {
    path: './dist/js/',
    filename: (config.mode == 'development') ? 'app.js' : "[name].[hash].js",
    pathinfo: true,
    devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
  },

  // debug: true,
  devtool: (config.mode == 'development') ? "eval-source-map" : "cheap-module-source-map",

  resolve: {
    modules: [
      "node_modules",

      // We are using bower for frontend libs.
      path.resolve(__dirname, "src/assets/bower_components"),
      path.resolve(__dirname, "src/app")
    ],
    alias: {
      nvd3: path.resolve(__dirname, "src/assets/bower_components/nvd3/build/nv.d3.min.js")
    },
    descriptionFiles: ["package.json", "bower.json"],
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: [/bower_components/, /node_modules/],
      loader: 'babel-loader',
      query: {
        compact: true,
        presets: ['es2015']
      }
    }, {
      test: /\.html$/,
      loader: 'html-loader',
      // query: {
      //   minimize: true
      // }
    }]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: (config.mode == 'development') ? "vendor.js" : "[name].[hash].js"
    }),
    new HtmlWebpackPlugin({
      title: "test title",
      filename: "../index.html",
      template: path.resolve(__dirname, "src/index.html")
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ]
};

if (config.mode != 'development') {
  var uglify = new webpack.optimize.UglifyJsPlugin({
    sourceMap: (config.mode == 'development') ? true : false,
    compress: {
      warnings: false,
    },
    output: {
      comments: false,
    },
  })

  webpackModule.plugins.push(uglify);
}

module.exports = webpackModule;