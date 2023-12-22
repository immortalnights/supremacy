import uws from "uWebSockets.js"

const PORT = 3010

const app = uws.App({})

interface UserData {
    id: string
}

app.ws<UserData>("/ws/*", {
    open(ws) {
        const userData = ws.getUserData()
        userData.id = crypto.randomUUID()
        console.log(`Opened ${userData.id}`)
    },
    message(ws, message, isBinary) {
        ws.send(message, isBinary, true)
    },
    close(ws, code, message) {
        const userData = ws.getUserData()
        console.log(`Closed ${userData.id}`)
    },
})

app.get("/*", (res, _req) => {
    res.writeStatus("200 OK")
        // .writeHeader("IsExample", "Yes")
        .end("WebSocket Connections Only")
})

app.listen(PORT, (listenSocket) => {
    if (listenSocket) {
        console.log(`Listening to port ${PORT}`)
    }
})
