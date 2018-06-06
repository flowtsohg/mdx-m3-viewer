let fs = require('fs');
let webpack = require('webpack');

module.exports = function(env, argv) {
  return {
    output: {
      filename: 'viewer.min.js',
      library: 'ModelViewer',
    },
    plugins: [
      new webpack.BannerPlugin(fs.readFileSync('LICENSE', 'utf8')),
    ],
    performance: {
      hints: false,
    },
    devtool: argv.mode === 'development' ? 'cheap-eval-source-map' : '',
  };
};
