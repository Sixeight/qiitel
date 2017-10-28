const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const common = require("./webpack.common.js");

const extractSass = new ExtractTextPlugin({
    filename: "css/[chunkhash].css"
});

module.exports = merge(common, {
    entry: {
        main: "./src/js/main.jsx",
        vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "react-waypoint",
            "react-helmet",
            "whatwg-fetch",
            "redux",
            "react-redux",
            "react-router-redux",
            "redux-thunk",
            "history/createBrowserHistory",
            "redux-devtools-extension"
        ]
    },
    output: {
        path: path.resolve(__dirname, "static"),
        filename: "js/[chunkhash].js"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true,
                            importLoaders: 1
                        }
                    }, {
                        loader: "postcss-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    publicPath: "static/css"
                })
            }
        ]
    },
    plugins: [
        new ManifestPlugin({
            fileName: "../config/manifest.json",
            publicPath: "/",
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new CleanWebpackPlugin(["static/js", "static/css"]),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "runtime"
        }),
        new webpack.optimize.UglifyJsPlugin(),
        extractSass
    ]
});
