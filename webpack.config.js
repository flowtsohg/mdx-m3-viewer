const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = function(env, argv) {
  return {
    output: {
      filename: 'viewer.min.js',
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
          include: path.resolve(__dirname, 'src'),
          loader: 'ts-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    devtool: argv.mode === 'development' ? 'cheap-eval-source-map' : '',
  };
};
