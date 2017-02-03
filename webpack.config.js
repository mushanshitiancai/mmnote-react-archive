const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/render/index.tsx',
    output: {
        path: path.join(__dirname, "dist"),
        filename: 'bundle.js',
        publicPath: "/assets/",
        // sourcePrefix: ''
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader?configFileName=tsconfig.render.json" },
            { test: /\.css$/, loaders: ["style-loader", "css-loader?sourceMap"] },
            { test: /\.less$/, loaders: ["style-loader", "css-loader?sourceMap", "less-loader"] },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            { test: /\.json$/, loader: 'json-loader' },
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    target: 'electron'
}