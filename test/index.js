var webpack = require('webpack');
var test = require('tape');
var path = require('path');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var InlineSizePlugin = require('../index');
var JSDOM = require('jsdom').JSDOM;

var dist = path.resolve(__dirname, 'dist');
var extractApp = new ExtractTextPlugin('css/app.[contenthash:5].css');
var extractVendor = new ExtractTextPlugin('css/vendor.[contenthash:5].css');
var toArray = function(val) {
  return [].slice.call(val);
};

test('test simple webpack config', function (t) {
  var config = {
    entry: {
      app: path.resolve(__dirname, 'src/app.js'),
      vendor: path.resolve(__dirname, 'src/vendor.js'),
    },
    output: {
      filename: 'js/[name].[chunkhash:5].js',
      path: dist,
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'file-loader'
        },
        {
          test: /app\.css/,
          use: extractApp.extract('css-loader')
        },
        {
          test: /[^app]\.css/,
          use: extractVendor.extract('css-loader')
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        inlineSize: 20 * 1024
      }),
      new InlineSizePlugin(),
      extractApp,
      extractVendor
    ]
  };
  webpack(config, function(err, stats) {
    t.equal(err, null);
    t.equal(stats.hasErrors(), false);
    var htmlContent = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
    var dom = new JSDOM(htmlContent);
    toArray(dom.window.document.scripts).forEach(function(script) {
      if (script.src) {
        t.true(/vendor/.test(script.src));
      } else {
        t.true(/this is app chunk/.test(script.textContent));
      }
    });
    toArray(dom.window.document.querySelectorAll('style')).forEach(function(style) {
      t.true(/this is app style/.test(style.textContent));
    });
    toArray(dom.window.document.querySelectorAll('link')).forEach(function(link) {
      if (link.rel === 'stylesheet') {
        t.true(/vendor/.test(link.href));
      }
    });
    t.end();
  });
});

