module.exports = {
    entry: "./src/exports.js",
    output: {
        filename: "viewer.min.js",
        library: "ModelViewer",
        libraryTarget: "var"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: function(modulePath)
                {
                    // glMatrix changed to ES6 imports, need to transpile it too.
                    // [\/\\] used to support both UNIX and Windows paths.
                    return /node_modules/.test(modulePath) && !/node_modules[\/\\]gl-matrix/.test(modulePath);
                },
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["babel-preset-es2015-script"],
                    }
                }
            },
        ]
    }
}
