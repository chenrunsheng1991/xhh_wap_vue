var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')
var cssLoaders = require('./css-loaders')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// whether to generate source map for production files.
// disabling this can speed up the build.
var SOURCE_MAP = true

var cssLoadersConf = cssLoaders({
  sourceMap: SOURCE_MAP,
  extract: true
});

var cssBaseConf = {
  css: ExtractTextPlugin.extract("css"),
  sass: ExtractTextPlugin.extract("css!sass-loader")
};

var vueLoaderConf = merge(cssLoadersConf, cssBaseConf);

module.exports = merge(baseConfig, {
  stats: {
    children: false
  },
  devtool: SOURCE_MAP ? '#source-map' : false,
  output: {
    // naming output files with hashes for better caching.
    // dist/index.html will be auto-generated with correct URLs.
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js'
  },
  vue: {
    loaders: vueLoaderConf
  },
  plugins: [
    // 提取公共依赖的js到common.js文件中
    new webpack.optimize.CommonsChunkPlugin('common.' + new Date().getTime() + '.js'),
    // http://vuejs.github.io/vue-loader/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    // extract css into its own file
    new ExtractTextPlugin('[name].[contenthash].css'),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
      }
    })
  ]
})