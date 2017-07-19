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
                exclude: /(node_modules)/,
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
