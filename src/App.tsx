import { RouterProvider } from "react-router-dom"
import {
    ManagerProvider,
    PeerConnectionProvider,
    WebSocketConnectionState,
    WebSocketProvider,
} from "webrtc-lobby-lib"
import { router } from "./router"
import "./App.css"
import { StrictMode } from "react"

function App() {
    return (
        <StrictMode>
            <WebSocketProvider>
                <PeerConnectionProvider>
                    <ManagerProvider>
                        <RouterProvider router={router} />
                        <div>
                            <a href="/">Return to main menu</a>
                        </div>
                        <WebSocketConnectionState />
                    </ManagerProvider>
                </PeerConnectionProvider>
            </WebSocketProvider>
        </StrictMode>
    )
}

export default App
