const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/js/main.jsx',
    output: {
        path: path.resolve(__dirname, 'static/js'),
        filename: '[name].js'
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
    }
};
