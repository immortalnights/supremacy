import { RouterProvider } from "react-router-dom"
import { WebSocketConnectionState, WebSocketProvider } from "webrtc-lobby-lib"
import { router } from "./router"
import "./App.css"

function App() {
    return (
        <WebSocketProvider>
            <RouterProvider router={router} />
            <WebSocketConnectionState />
        </WebSocketProvider>
    )
}

export default App
