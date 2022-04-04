const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = (app) => {
    // app.use(
    //     "/api",
    //     createProxyMiddleware({
    //         target: "http://localhost:3010",
    //     })
    // )
    app.use(
        createProxyMiddleware("/socket.io", {
            target: "http://localhost:3010/socket-io",
            ws: true,
        })
    )
}