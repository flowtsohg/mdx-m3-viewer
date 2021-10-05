const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  let entry;

  if (env.umd) {
    // The repo as a library.
    entry = {
      'viewer': { import: './src/index.ts', filename: 'umd/viewer.min.js', library: { name: 'ModelViewer', type: 'var' } },
    };
  } else {
    // Built-in clients.
    entry = {
      'example': { import: './clients/example/index.js', filename: 'clients/example.min.js' },
      'downgrader': { import: './clients/downgrader/index.js', filename: 'clients/downgrader.min.js' },
      'map': { import: './clients/map/index.js', filename: 'clients/map.min.js' },
      'mdlx': { import: './clients/mdlx/index.js', filename: 'clients/mdlx.min.js' },
      'rebuild': { import: './clients/rebuild/index.js', filename: 'clients/rebuild.min.js' },
      'sanitytest': { import: './clients/sanitytest/index.js', filename: 'clients/sanitytest.min.js' },
      'tests': { import: './clients/tests/index.js', filename: 'clients/tests.min.js' },
      'weu': { import: './clients/weu/index.js', filename: 'clients/weu.min.js' },
      'mdlxoptimizer': { import: './clients/mdlxoptimizer/index.ts', filename: 'clients/mdlxoptimizer.min.js' },
    };
  }

  return {
    entry,
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
  };
};
