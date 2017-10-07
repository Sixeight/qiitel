const path = require('path')

module.exports = {
    entry: './src/js/main.jsx',
    output: {
        path: path.join(__dirname, 'static/js'),
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
    }
}
