import React from "react"
import { io, Socket } from "socket.io-client"
import { ServerToClientEvents, ClientToServerEvents } from "../types.d"
import { useNavigate, NavigateFunction } from "react-router-dom"

// Socket IO definitions
type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents> | undefined

// Socket connection status
export type Status = "disconnected" | "connecting" | "connected"

// Context interface
export interface IIOContext {
  connected: () => boolean
  createRoom: () => Promise<void>
  joinRoom: (id: string) => Promise<void>
  leaveRoom: () => void
  playerToggleReady: () => void
  createGame: () => void
}

// Connection Context
export const IOContext = React.createContext<IIOContext>({
  connected: () => false,
  createRoom: () => Promise.reject(),
  joinRoom: () => Promise.reject(),
  leaveRoom: () => {},
  playerToggleReady: () => {},
  createGame: () => {},
})

export type MessageHandler = (action: string, data: any) => void

// Context Provider
const IOProvider = ({ handleMessage, children }: { handleMessage: MessageHandler, children: JSX.Element }) => {
  const [ socket, setSocket ] = React.useState<SocketIO>(undefined)
  const navigate = useNavigate()

  console.log("Render IOProvider")

  React.useEffect(() => {
    console.log("Creating Socket.IO")
    const socket: SocketIO = io("http://localhost:3000", {
      transports: ["websocket"]
    })

    socket.on("connect_error", (err) => {
      console.log("connection error", err)
      setSocket(undefined)
    })
    socket.on("connect", () => {
      console.log("client connected", socket.id)
      setSocket(socket)
    })
    socket.on("disconnect", () => {
      console.log("client disconnected")
      setSocket(undefined)
      handleMessage("disconnect", {})
      navigate("/")
    })

    // socket.on("registered", (data) => handleMessage("registered", data))
    // socket.on("room-joined", (data) => handleMessage("room-joined", data))
    // socket.on("room-player-joined", (data) => handleMessage("room-player-joined", data))
    // socket.on("room-player-left", (data) => handleMessage("room-player-left", data))
    // socket.on("room-player-kicked", () => handleMessage("room-player-kicked", {}))
    // socket.on("room-update", () => handleMessage("room-update", {}))
    // socket.on("player-ready-status-changed", (data) => handleMessage("player-ready-status-changed", data))
    socket.onAny(handleMessage)

    console.log("Init socket", socket.id)
    return () => {
      console.log("Clean up IOProvider")
      socket.disconnect()
      setSocket(undefined)
      handleMessage("disconnect", {})
      navigate("/")
    }
  }, [ handleMessage, setSocket ])

  const contextValue = {
    connected: () => !!socket,
    createRoom: () => {
      console.log("Socket id", socket?.id)
      console.assert(socket, "Socket is invalid!")
      return new Promise<void>((resolve, reject) => {
        socket?.emit("room-create", (ok: boolean) => {
          if (ok)
          {
            resolve()
          }
          else
          {
            reject()
          }
        })
      })
    },
    joinRoom: (id: string) => {
      console.log("Socket id", socket?.id)
      console.assert(socket, "Socket is invalid!")
      return new Promise<void>((resolve, reject) => {
        socket?.emit("room-join", id, (ok: boolean) => {
          if (ok)
          {
            resolve()
          }
          else
          {
            reject()
          }
        })
      })
    },
    leaveRoom: () => {
      console.log("Socket id", socket?.id)
      console.assert(socket, "Socket is invalid!")
      socket?.emit("room-leave")
      handleMessage("room-player-kicked", {})
    },
    playerToggleReady: () => {
      console.log("Socket id", socket?.id)
      console.assert(socket, "Socket is invalid!")
      socket?.emit("player-ready-toggle")
    },
    createGame: () => {
      console.log("Socket id", socket?.id)
      console.assert(socket, "Socket is invalid!")
      socket?.emit("create-game")
    },
  }

  console.log("Socket id", socket?.id)

  return (
    <IOContext.Provider value={contextValue}>
      {children}
    </IOContext.Provider>
  )
}

export default IOProvider