import assert from 'assert';
import path from 'path';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';

export default class HtmlWebpackInlineSizePlugin {
  constructor(options) {
    assert.equal(options, undefined, 'The HtmlWebpackInlineSizePlugin does not accept any options');
  }
  apply(compiler) {
    compiler.apply(new HtmlWebpackInlineSourcePlugin());
    compiler.plugin('compilation', function(compilation) {
      compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
        const inlineSize = Number(htmlPluginData.plugin.options.inlineSize);
        const inlineSource = htmlPluginData.plugin.options.inlineSource;
        if (!inlineSize) { return callback(); }
        const cssAndJsList = [
          ...htmlPluginData.assets.css,
          ...htmlPluginData.assets.js
        ];
        const chunkFiles = cssAndJsList.map(fileName => {
          const name = path.posix.relative(htmlPluginData.assets.publicPath, fileName);
          if (/\.(js|css)$/.test(name)) {
            const asset = compilation.assets[name];
            if (asset && typeof asset.size === 'function' && asset.size() <= inlineSize) {
              return `(${name})`;
            }
          }
        }).concat(inlineSource ? `(${inlineSource})` : '').filter(Boolean);
        if (chunkFiles.length) {
          htmlPluginData.plugin.options.inlineSource = chunkFiles.join('|');
        }
        callback(null, htmlPluginData);
      });
    });
  }
}
