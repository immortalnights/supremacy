import { RouterProvider } from "react-router-dom"
import {
    ManagerProvider,
    PeerConnectionProvider,
    WebSocketConnectionState,
    WebSocketProvider,
} from "webrtc-lobby-lib"
import { router } from "./router"
import "./App.css"
import { ReactNode, StrictMode } from "react"

function MultiplayerProvider({ children }: { children: ReactNode }) {
    return (
        <WebSocketProvider>
            <PeerConnectionProvider>
                <ManagerProvider>
                    {children}
                    <WebSocketConnectionState />
                </ManagerProvider>
            </PeerConnectionProvider>
        </WebSocketProvider>
    )
}

function App() {
    return (
        <StrictMode>
            <MultiplayerProvider>
                <RouterProvider router={router} />
                <div>
                    <a href="/">Return to main menu</a>
                </div>
            </MultiplayerProvider>
        </StrictMode>
    )
}

export default App
