const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => ({
  entry: './src/index.ts',
  output: {
    filename: 'viewer.min.js',
    path: path.resolve(__dirname, 'dist/'),
    library: 'ModelViewer',
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
  devtool: argv.mode === 'development' ? 'cheap-module-eval-source-map' : '',
});
