const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/js/main.jsx',
    output: {
        path: path.resolve(__dirname, 'static/js'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]
}
