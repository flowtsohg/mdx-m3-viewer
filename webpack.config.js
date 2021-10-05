const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => ({
  entry: {
    // The repo as a library.
    'viewer': { import: './src/index.ts', filename: 'bundles/viewer.min.js', library: { name: 'ModelViewer', type: 'var' } },
    // Built-in clients.
    'example': { import: './clients/example/index.js', filename: 'bundles/example.min.js' },
    'downgrader': { import: './clients/downgrader/index.js', filename: 'bundles/downgrader.min.js' },
    'map': { import: './clients/map/index.js', filename: 'bundles/map.min.js' },
    'mdlx': { import: './clients/mdlx/index.js', filename: 'bundles/mdlx.min.js' },
    'rebuild': { import: './clients/rebuild/index.js', filename: 'bundles/rebuild.min.js' },
    'sanitytest': { import: './clients/sanitytest/index.js', filename: 'bundles/sanitytest.min.js' },
    'tests': { import: './clients/tests/index.js', filename: 'bundles/tests.min.js' },
    'weu': { import: './clients/weu/index.js', filename: 'bundles/weu.min.js' },
    'mdlxoptimizer': { import: './clients/mdlxoptimizer/index.ts', filename: 'bundles/mdlxoptimizer.min.js' },
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
        loader: 'ts-loader',
        options: { compilerOptions: { module: 'esnext', declaration: false } }
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  devtool: argv.mode === 'development' ? 'eval-cheap-module-source-map' : false,
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
});
