const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = function (env, argv) {
  return {
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
            {
              loader: 'ts-loader',
              options: {
                // This is needed until such a day when there are no type errors.
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.(glsl|vert|frag)$/,
          exclude: /node_modules/,
          use: [
            'raw-loader',
            {
              loader: 'glslify-loader',
              options: {
                transform: [
                  'glslify-import',
                ]
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.glsl', '.vert', '.frag'],
    },
    devtool: argv.mode === 'development' ? 'cheap-module-eval-source-map' : '',
  };
};
