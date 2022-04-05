const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = (app) => {
    app.use(
        createProxyMiddleware("/socket.io", {
            target: "http://localhost:3010/socket.io",
            ws: true,
        })
    )
}