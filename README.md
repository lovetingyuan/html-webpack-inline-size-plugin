
# html-webpack-inline-size-plugin

 💝 Embed javascript and css source with size limit inside of html when using webpack

[![travis-ci](https://travis-ci.org/lovetingyuan/html-webpack-inline-size-plugin.svg?branch=master "CI")](https://travis-ci.org/lovetingyuan/html-webpack-inline-size-plugin)
[![Version](https://img.shields.io/npm/v/html-webpack-inline-size-plugin.svg "version")](https://www.npmjs.com/package/html-webpack-inline-size-plugin)
[![Dependencies](https://david-dm.org/lovetingyuan/html-webpack-inline-size-plugin/status.svg "dependencies")](https://david-dm.org/lovetingyuan/html-webpack-inline-size-plugin)
[![License](https://img.shields.io/npm/l/html-webpack-inline-size-plugin.svg "License")](https://github.com/lovetingyuan/html-webpack-inline-size-plugin/blob/master/LICENSE)

<img src="https://github.com/webpack/media/blob/master/logo/logo-on-white-bg.png" alt="webpack-logo" width="320" >


### install
`npm install html-webpack-inline-size-plugin --save-dev`

or

`yarn add html-webpack-inline-size-plugin -D`

### usage

1. specify **`inlineSize`** option in [`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin/)
2. use `html-webpack-inline-size-plugin`

the option **`inlineSource`** used by [`html-webpack-inline-source-plugin`](https://github.com/dustinjackson/html-webpack-inline-source-plugin) is also supported

### example

webpack.config.js

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSizePlugin = require('html-webpack-inline-size-plugin');

const webpackConfig = {
  // ... 
  plugins: [
     new HtmlWebpackPlugin({
      inject: true,
      template: 'index.html',
      // other config options
      inlineSize: 5 * 1024 // files that size is smaller than 5kb will be inline in html
    }),
    new HtmlWebpackInlineSizePlugin()
  ]
}
```

### license
MIT
