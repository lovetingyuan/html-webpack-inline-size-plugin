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

var _package = require('../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HtmlWebpackInlineSizePlugin = function () {
  function HtmlWebpackInlineSizePlugin(options) {
    _classCallCheck(this, HtmlWebpackInlineSizePlugin);

    _assert2.default.equal(options, undefined, _package.name + ' does not accept any options');
  }

  _createClass(HtmlWebpackInlineSizePlugin, [{
    key: '_filterFiles',
    value: function _filterFiles(compilation, htmlPluginData, callback) {
      var inlineSize = Number(htmlPluginData.plugin.options.inlineSize);
      var inlineSource = htmlPluginData.plugin.options.inlineSource;
      if (!inlineSize) {
        return callback();
      }
      var chunkFiles = [].concat(_toConsumableArray(htmlPluginData.assets.css), _toConsumableArray(htmlPluginData.assets.js)).map(function (fileName) {
        if (!/\.(js|css)$/.test(fileName)) return;
        var name = _path2.default.posix.relative(htmlPluginData.assets.publicPath, fileName);
        var asset = compilation.assets[name];
        if (asset && typeof asset.size === 'function' && asset.size() <= inlineSize) {
          return name;
        }
      }).concat(inlineSource || '').filter(Boolean);
      if (!chunkFiles.length) return callback();
      htmlPluginData.plugin.options.inlineSource = '(' + chunkFiles.join('|') + ')';
      callback(null, htmlPluginData);
    }
  }, {
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      var inlineSourcePlugin = new _htmlWebpackInlineSourcePlugin2.default();
      if (compiler.hooks) {
        compiler.hooks.compilation.tap(_package.name, function (compilation) {
          compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(_package.name, function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            _this._filterFiles.apply(_this, [compilation].concat(args));
          });
        });
        inlineSourcePlugin.apply(compiler);
      } else {
        compiler.plugin('compilation', function (compilation) {
          var _this2 = this;

          compilation.plugin('html-webpack-plugin-before-html-generation', function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            _this2._filterFiles.apply(_this2, [compilation].concat(args));
          });
        });
        compiler.apply.apply(compiler, [inlineSourcePlugin]);
      }
    }
  }]);

  return HtmlWebpackInlineSizePlugin;
}();

exports.default = HtmlWebpackInlineSizePlugin;