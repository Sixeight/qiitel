module.exports = {
    syntax: require("postcss-scss"),
    plugins: [
        require("autoprefixer")({
            browsers: ["last 2 versions"]
        })
    ]
};
