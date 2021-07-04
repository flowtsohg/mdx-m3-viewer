const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => ({
  entry: {
    'viewer': { import: './src/index.ts', filename: 'viewer.min.js', library: { name: 'ModelViewer', type: 'var' } },
  },
  plugins: [
    new webpack.BannerPlugin(fs.readFileSync('LICENSE', 'utf8')),
    // Note: this is needed to compile fengari for the web.
    new webpack.DefinePlugin({
      'process.env.FENGARICONF': 'void 0',
      'typeof process': JSON.stringify('undefined'),
    }),
  ],
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          'ts-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: argv.mode === 'development' ? 'eval-cheap-module-source-map' : false,
});
