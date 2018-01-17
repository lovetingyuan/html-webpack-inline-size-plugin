'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _htmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

var _htmlWebpackInlineSourcePlugin2 = _interopRequireDefault(_htmlWebpackInlineSourcePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HtmlWebpackInlineSizePlugin = function () {
  function HtmlWebpackInlineSizePlugin(options) {
    _classCallCheck(this, HtmlWebpackInlineSizePlugin);

    _assert2.default.equal(options, undefined, 'The HtmlWebpackInlineSizePlugin does not accept any options');
  }

  _createClass(HtmlWebpackInlineSizePlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      compiler.apply(new _htmlWebpackInlineSourcePlugin2.default());
      compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
          var inlineSize = Number(htmlPluginData.plugin.options.inlineSize);
          var inlineSource = htmlPluginData.plugin.options.inlineSource;
          if (!inlineSize) {
            return callback();
          }
          var cssAndJsList = [].concat(_toConsumableArray(htmlPluginData.assets.css), _toConsumableArray(htmlPluginData.assets.js));
          var chunkFiles = cssAndJsList.map(function (fileName) {
            var name = _path2.default.posix.relative(htmlPluginData.assets.publicPath, fileName);
            if (/\.(js|css)$/.test(name)) {
              var asset = compilation.assets[name];
              if (asset && typeof asset.size === 'function' && asset.size() <= inlineSize) {
                return '(' + name + ')';
              }
            }
          }).concat(inlineSource ? '(' + inlineSource + ')' : '').filter(Boolean);
          if (chunkFiles.length) {
            htmlPluginData.plugin.options.inlineSource = chunkFiles.join('|');
          }
          callback(null, htmlPluginData);
        });
      });
    }
  }]);

  return HtmlWebpackInlineSizePlugin;
}();

exports.default = HtmlWebpackInlineSizePlugin;