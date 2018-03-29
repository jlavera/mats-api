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
      test: /.*/,
      use: 'file-loader?name=static/[ext]/[name].[ext]',
      exclude: [
        /npm\.js/,
        /.eot/,
        /.svg/,
        /.ttf/,
        /.woff/,
        /.woff2/,
      ],
      include: [
        path.resolve(__dirname, "web/static")
      ]
    }, {
      test: /.*/,
      use: 'file-loader?name=static/fonts/[name].[ext]',
      exclude: [
        /npm\.js/,
        /.js/,
        /.css/
      ],
      include: [
        path.resolve(__dirname, "web/static")
      ]
    }]
  },
  entry: [
    './web/js/index',
    './web/index.html'
  ],
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js',]
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
    fs: "empty"
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
