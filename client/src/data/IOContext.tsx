import React from "react"
import { io, Socket } from "socket.io-client"

// Socket IO definitions
type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents> | undefined

// Messages from the client to the Server
interface ClientToServerEvents {
  "room-create": () => void
  "room-join": (id: string) => void
  "room-leave": () => void
  "room-set-options": () => void
  "player-ready-toggle": () => void
  "create-game": (seed: number) => void
}

// Messages from the server to the client
interface ServerToClientEvents {
  withAck: (d: string, cb: (e: number) => void) => void
  "room-joined": (roomID: string) => void
  "room-closed": (roomID: string) => void
}

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

  React.useEffect(() => {
    console.log("Creating Socket.IO")
    const socket = io("http://localhost:3000", {
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
    })

    socket.on("room-joined", (data) => handleMessage("room-joined", data))
    socket.on("room-closed", (data) => handleMessage("room-closed", data))
    //  ({ playerID, roomID }) => {
    //   console.log(playerID, "joined room", roomID)
    //   handleMessage("room-joined", { playerID, roomID })
    // })

    // socket.on("room-closed", () => {
    //   console.log("closed room")
    //   handleMessage("room-closed")
    // })

    socket.on("update", handleMessage)

    setSocket(socket)
    return () => {
      socket.disconnect()
      setSocket(undefined)
      setStatus("disconnected")
    }
  }, [])

  const contextValue = {
    status,
    createRoom: () => {
      socket?.emit("room-create")
    },
    joinRoom: (id: string) => {
      socket?.emit("room-join", id)
    },
    leaveRoom: () => {
      socket?.emit("room-leave")
    },
    playerToggleReady: () => {
      socket?.emit("player-ready-toggle")
    },
    createGame: () => {
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