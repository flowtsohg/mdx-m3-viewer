var fs = require('fs');
var webpack = require('webpack');
// webpack internally uses an older version of the plugin until webpack 4.x.
// The newer version is needed for ES6, so use it directly for now.
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let data = {
    entry: './src/index.js',
    output: {
        filename: 'viewer.min.js',
        library: 'ModelViewer',
        libraryTarget: 'var'
    },
    plugins: [new webpack.BannerPlugin(fs.readFileSync('LICENSE', 'utf8'))]
};

if (process.env.NODE_ENV === 'production') {
    data.plugins.push(new UglifyJsPlugin()); // Minification.
} else {
    data.devtool = '#cheap-module-eval-source-map'; // For debugging in devtools.
}

module.exports = data;
