import assert from 'assert';
import path from 'path';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';
const pluginName = 'HtmlWebpackInlineSizePlugin';

export default class HtmlWebpackInlineSizePlugin {
  constructor(options) {
    assert.equal(options, undefined, `${pluginName} does not accept any options`);
  }
  _filterFiles(compilation, htmlPluginData, callback) {
    const inlineSize = Number(htmlPluginData.plugin.options.inlineSize);
    const inlineSource = htmlPluginData.plugin.options.inlineSource;
    if (!inlineSize) { return callback(); }
    const chunkFiles = [
      ...htmlPluginData.assets.css,
      ...htmlPluginData.assets.js
    ].map(fileName => {
      if (!/\.(js|css)$/.test(fileName)) return;
      const name = path.posix.relative(htmlPluginData.assets.publicPath, fileName);
      const asset = compilation.assets[name];
      if (asset && typeof asset.size === 'function' && asset.size() <= inlineSize) {
        return `(${name})`;
      }
    }).concat(inlineSource ? `(${inlineSource})` : '').filter(Boolean);
    if (!chunkFiles.length) return callback();
    htmlPluginData.plugin.options.inlineSource = chunkFiles.join('|');
    callback(null, htmlPluginData);
  }
  apply(compiler) {
    const inlineSourcePlugin = new HtmlWebpackInlineSourcePlugin();
    if (compiler.hooks) {
      compiler.hooks.compilation.tap(pluginName, (compilation) => {
        compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(pluginName, (...args) => {
          this._filterFiles(compilation, ...args);
        });
      });
      inlineSourcePlugin.apply(compiler);
    } else {
      compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-before-html-generation', (...args) => {
          this._filterFiles(compilation, ...args);
        });
      });
      compiler.apply.apply(compiler, [inlineSourcePlugin]);
    }
  }
}
