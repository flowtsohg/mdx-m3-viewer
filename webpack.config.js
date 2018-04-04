let fs = require('fs');
let webpack = require('webpack');

module.exports = {
    output: {
        filename: 'viewer.min.js',
        library: 'ModelViewer'
    },
    plugins: [new webpack.BannerPlugin(fs.readFileSync('LICENSE', 'utf8'))],
    performance: { hints: false }
};
