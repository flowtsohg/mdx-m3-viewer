module.exports = {
    entry: "./src/exports.js",
    output: {
        filename: 'bundle.js',
        library: 'ModelViewer',
        libraryTarget: 'var'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: function(modulePath)
                {
                    return /node_modules/.test(modulePath) &&
                    !/node_modules\/gl-matrix/.test(modulePath);
                },
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-es2015-script'],
                    }
                }
            },
        ]
    }
}
