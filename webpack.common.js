const path = require("path");

module.exports = {
    entry: "./src/js/main.jsx",
    output: {
        path: path.resolve(__dirname, "static"),
        filename: "js/[name].js"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["es2015", "react"],
                        plugins: ["transform-object-rest-spread"]
                    }
                }
            }
        ]
    }
};
