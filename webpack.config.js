const webpack = require('webpack');
const path    = require('path');

module.exports = {
  module: {
    rules: [{
      test: /\.json$/,
      use: 'json-loader'
    }, {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [
        'babel-loader',
      ],
    }, {
      test: /\.html$/,
      use: 'file-loader?name=[name].[ext]',
      include: /web/
    }, {
      test: /\.styl$/i,
      use: [
        'style-loader',
        'css-loader',
        'stylus-loader'
      ]
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      use: 'file-loader?name=static/fonts/[name].[ext]',
      exclude: [
        /npm\.js/,
        /\.js/,
        /\.css/
      ],
      include: [
        path.resolve(__dirname, 'web/static/fonts')
      ]
    }, {
      test: /\.css$/,
      use: 'file-loader?name=static/css/[name].[ext]',
      exclude: [
        /npm\.js/
      ],
      include: [
        path.resolve(__dirname, 'web/static/css')
      ]
    }, {
      test: /\.png$/,
      use: 'file-loader?name=static/images/[name].[ext]',
      include: [
        path.resolve(__dirname, 'web/static/images')
      ]
    }, {
      test: /\.ico$/,
      use: 'file-loader?name=static/[name].[ext]',
      include: [
        path.resolve(__dirname, 'web/static')
      ]
    }, {
      test: /\.js$/,
      use: 'file-loader?name=static/js/[name].[ext]',
      exclude: [
        /npm\.js/
      ],
      include: [
        path.resolve(__dirname, 'web/static/js')
      ]
    }]
  },
  entry: [
    './web/js/index',
    './web/index.html'
  ],
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js']
    // extensions: ['.jsx', '.js']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
