import { ReactNode, createContext, useEffect, useState } from "react"

interface WebSocketContextProps {
    socket?: WebSocket | null
    joinRoom: (room: string) => void
}

export const WebSocketContext = createContext<WebSocketContextProps>({
    joinRoom: () => {},
})

interface WebSocketProviderProps {
    children: ReactNode
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [currentRoom, setCurrentRoom] = useState<string | null>(null)

    useEffect(() => {
        if (socket && currentRoom) {
            // Logic to join the room when the socket is available
            // socket.subscribe(currentRoom)
        }
    }, [socket, currentRoom])

    const joinRoom = (room: string) => {
        // Unsubscribe from the current room before joining the new one
        if (socket && currentRoom) {
            // socket.unsubscribe(currentRoom)
        }

        setCurrentRoom(room)
    }

    useEffect(() => {
        const newSocket = new WebSocket(`ws://${window.location.host}/ws`)
        setSocket(newSocket)

        newSocket.addEventListener("open", () => {
            console.log("onopen")
        })
        newSocket.addEventListener("message", () => {
            console.log("onmessage")
        })
        newSocket.addEventListener("close", () => {
            console.log("onclose")
        })

        return () => {
            console.log("Closing...")
            newSocket.close()
        }
    }, [])

    return (
        <WebSocketContext.Provider value={{ socket, joinRoom }}>
            {children}
        </WebSocketContext.Provider>
    )
}
