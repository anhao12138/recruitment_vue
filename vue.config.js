module.exports = {
    publicPath: "/recruitment",
    devServer: {
        // https: true,
        port: 8081,
        open: true, // opens browser window automatically

        proxy: {
            "/": {
                target: "http://127.0.0.1:8080",
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    "^/api": "/" //路径重写
                }
            }
        }
    }
};