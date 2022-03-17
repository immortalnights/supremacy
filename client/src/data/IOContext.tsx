import React from "react"
import { useNavigate } from "react-router"
import { io, Socket } from "socket.io-client"
import { ServerToClientEvents, ClientToServerEvents } from "../types.d"

// Socket IO definitions
type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents> | undefined

// Socket connection status
export type Status = "disconnected" | "connecting" | "connected"

// Context interface
export interface IIOContext {
  status: Status
  createRoom: () => void
  joinRoom: (id: string) => void
  leaveRoom: () => void
  playerToggleReady: () => void
  createGame: () => void
}

// Connection Context
export const IOContext = React.createContext<IIOContext>({
  status: "disconnected",
  createRoom: () => {},
  joinRoom: () => {},
  leaveRoom: () => {},
  playerToggleReady: () => {},
  createGame: () => {},
})

export type MessageHandler = (action: string, data: any) => void

// Context Provider
const IOProvider = ({ handleMessage, children }: { handleMessage: MessageHandler, children: JSX.Element }) => {
  const [ status, setStatus ] = React.useState<Status>("disconnected")
  const [ socket, setSocket ] = React.useState<SocketIO>(undefined)
  const navigate = useNavigate()

  console.log("provider has changed", !!socket)

  React.useEffect(() => {
    console.log("Creating Socket.IO")
    const socket: SocketIO = io("http://localhost:3000", {
      transports: ["websocket"]
    })

    socket.on("connect_error", (err) => {
      console.log("connection error", err)
      setStatus("disconnected")
    })
    socket.on("connect", () => {
      console.log("client connected")
      setStatus("connected")
    })
    socket.on("disconnect", () => {
      console.log("client disconnected")
      setStatus("disconnected")
      handleMessage("disconnect", {})
      navigate("/")
    })

    socket.on("registered", (data) => handleMessage("registered", data))
    socket.on("room-joined", (data) => handleMessage("room-joined", data))
    socket.on("room-player-joined", (data) => handleMessage("room-player-joined", data))
    socket.on("room-player-left", (data) => handleMessage("room-player-left", data))
    socket.on("room-player-kicked", () => handleMessage("room-player-kicked", {}))
    socket.on("player-ready-status-changed", (data) => handleMessage("player-ready-status-changed", data))

    setSocket(socket)
    return () => {
      console.log("Clean up IOProvider")
      socket.disconnect()
      setSocket(undefined)
      setStatus("disconnected")
      handleMessage("disconnect", {})
      navigate("/")
    }
  }, [])

  const contextValue = {
    status,
    createRoom: () => {
      console.assert(socket, "Socket is invalid!")
      socket?.emit("room-create")
    },
    joinRoom: (id: string) => {
      console.assert(socket, "Socket is invalid!")
      socket?.emit("room-join", id)
    },
    leaveRoom: () => {
      console.assert(socket, "Socket is invalid!")
      socket?.emit("room-leave")
    },
    playerToggleReady: () => {
      console.assert(socket, "Socket is invalid!")
      socket?.emit("player-ready-toggle")
    },
    createGame: () => {
      console.assert(socket, "Socket is invalid!")
      socket?.emit("create-game", 0)
    },
  }

  return (
    <IOContext.Provider value={contextValue}>
      {children}
    </IOContext.Provider>
  )
}

export default IOProvider