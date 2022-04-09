import React from "react"
import { io, Socket } from "socket.io-client"
import { PlayerRoomAction } from "../types"
import { ServerToClientEvents, ClientToServerEvents } from "../types.d"
import { useNavigate } from "react-router-dom"

// Socket IO definitions
type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>

// Socket connection status
export type Status = "disconnected" | "connecting" | "connected"

// Context interface
export interface IIOContext {
  connected: () => boolean
  requestRooms: () => void
  createRoom: () => Promise<void>
  joinRoom: (id: string) => Promise<void>
  leaveRoom: () => void
  roomAction: (name: PlayerRoomAction, data: any) => Promise<void>
  joinGame: (id: string) => Promise<void>
  leaveGame: () => void,
  action: (name: string, data: any) => Promise<void>
}

// Connection Context
export const IOContext = React.createContext<IIOContext>({
  connected: () => false,
  requestRooms: () => {},
  createRoom: () => Promise.reject(),
  joinRoom: () => Promise.reject(),
  leaveRoom: () => {},
  roomAction: (name: PlayerRoomAction, data: any) => Promise.reject(),
  joinGame: () => Promise.reject(),
  leaveGame: () => {},
  action: (name: string, data: any) => Promise.reject(),
})

export type MessageHandler = (action: string, data: any) => void

// Context Provider
const IOProvider = ({ handleMessage, children }: { handleMessage: MessageHandler, children: JSX.Element }) => {
  const [ socket, setSocket ] = React.useState<SocketIO | undefined>(undefined)
  const navigate = useNavigate()

  console.log("Render IOProvider")

  React.useEffect(() => {
    console.log("Creating Socket.IO")
    const s: SocketIO = io({
      transports: ["websocket"]
    })

    s.on("connect_error", (err) => {
      console.log("connection error", err)
      setSocket(undefined)
    })
    s.on("connect", () => {
      console.log("client connected", s.id, s.io.engine.transport.name)

      s.io.engine.on("upgrade", () => {
        console.log("upgraded", s.io.engine.transport.name)
      });

      setSocket(s)
    })
    s.on("disconnect", () => {
      console.log("client disconnected")
      setSocket(undefined)
      handleMessage("disconnect", {})
      navigate("/")
    })

    s.onAny(handleMessage)

    s.on("game-created", ({ id }) => {
      // console.log(`Received game-created for ${id}`)
      navigate(`/game/${id}/`, { replace: true })
    })

    return () => {
      console.log("Clean up IOProvider")
      s.disconnect()
      setSocket(undefined)
      handleMessage("disconnect", {})
      navigate("/")
    }
  }, [ handleMessage, setSocket ])

  const contextValue = {
    connected: () => !!socket,
    requestRooms: () => {
      console.assert(socket, "Socket is invalid!")
      socket?.emit("request-rooms")
    },
    createRoom: () => {
      console.assert(socket, "Socket is invalid!")
      return new Promise<void>((resolve, reject) => {
        socket?.emit("player-create-room", (ok: boolean) => {
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
      console.assert(socket, "Socket is invalid!")
      return new Promise<void>((resolve, reject) => {
        socket?.emit("player-join-room", id, (ok: boolean) => {
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
      console.assert(socket, "Socket is invalid!")
      socket?.emit("player-leave-room")
      handleMessage("room-player-kicked", {})
    },
    roomAction: (name: string, data: any) => {
      console.assert(socket, "Socket is invalid!")
      return new Promise<void>((resolve, reject) => {
        socket?.emit("player-room-action", name as PlayerRoomAction, data, (ok: boolean, reason: string, data: object) => {
          if (ok)
          {
            // handleRoomUpdate()?
            resolve()
          }
          else
          {
            reject(reason)
          }
        })
      })
    },
    joinGame: (id: string) => {
      console.assert(socket, "Socket is invalid!")
      return new Promise<void>((resolve, reject) => {
        socket?.emit("player-join-game", id, (ok: boolean) => {
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
    leaveGame: () => {
      // console.log("Socket id", socket?.id)
      console.assert(socket, "Socket is invalid!")
      socket?.emit("player-leave-game")
      handleMessage("game-player-kicked", {})
    },
    action: (name: string, data: any) => {
      console.assert(socket, "Socket is invalid!")
      return new Promise<void>((resolve, reject) => {
        console.debug(`Sending ${name}`, data)
        socket?.emit("player-game-action", name, data, (ok: boolean, reason: string, data: object) => {
          if (ok)
          {
            handleMessage("partial-game-update", data)
            resolve()
          }
          else
          {
            reject(reason)
          }
        })
      })
    }
  }

  console.log("Socket id", socket?.id)

  return (
    <IOContext.Provider value={contextValue}>
      {children}
    </IOContext.Provider>
  )
}

export default IOProvider