import React from "react"
import { io, Socket } from "socket.io-client"
import { PlayerRoomAction } from "../types"
import { PlayerGameAction } from "../simulation/types"
import {
    ServerToClientEvents,
    ClientToServerEvents,
    IRoom,
} from "@server/types"

// Socket IO definitions
type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>

// Socket connection status
export type Status = "disconnected" | "connecting" | "connected"

export interface ILobbyContext {
    connected: boolean
    createRoom: () => Promise<IRoom>
    joinRoom: (id: string) => Promise<void>
    leaveRoom: () => void
    subscribe: (key: string) => void
    unsubscribe: (key: string) => void
    roomAction: (name: PlayerRoomAction, data: object) => Promise<void>
    joinGame: (id: string) => Promise<void>
    leaveGame: () => void
}

// Context interface
export interface IIOContext extends ILobbyContext {
    action: (name: PlayerGameAction, data: object) => Promise<void>
}

// Connection Context
export const IOContext = React.createContext<IIOContext>({
    connected: false,
    createRoom: () => Promise.reject(),
    joinRoom: () => Promise.reject(),
    leaveRoom: () => {},
    subscribe: (_key: string) => Promise.reject(),
    unsubscribe: (_key: string) => {},
    roomAction: (_name: PlayerRoomAction, _data: any) => Promise.reject(),
    joinGame: () => Promise.reject(),
    leaveGame: () => {},
    action: (_name: PlayerGameAction, _data: object = {}) => Promise.reject(),
})

export type MessageHandler = (action: string, data: any) => void

// Context Provider
const IOProvider = ({
    handleMessage,
    children,
}: {
    handleMessage: MessageHandler
    children: React.ReactNode
}) => {
    const [socket, setSocket] = React.useState<SocketIO | undefined>(undefined)

    console.log("Render IOProvider")

    const handleDisconnect = (s: SocketIO) => {
        // don't disconnect the socket manually as doing so
        // prevents auto-reconnecting
        setSocket(undefined)
        // Clean up state
        handleMessage("disconnect", {})
    }

    React.useEffect(() => {
        console.log("Creating Socket.IO")
        const s: SocketIO = io({
            transports: ["websocket"],
        })
        s.on("disconnect", (reason) => {
            console.log("Client disconnected", reason)
            handleDisconnect(s)
        })
        s.on("connect_error", (err) => {
            console.log("connection error", err)
            setSocket(undefined)
        })
        s.on("connect", () => {
            console.log("client connected", s.id, s.io.engine.transport.name)

            s.io.engine.on("upgrade", () => {
                console.log("upgraded", s.io.engine.transport.name)
            })

            setSocket(s)
        })

        s.onAny(handleMessage)

        return () => {
            console.log("Clean up IOProvider")
            s.disconnect()
            handleDisconnect(s)
        }
    }, [handleMessage])

    const contextValue = {
        connected: !!socket,
        createRoom: () => {
            console.assert(socket, "Socket is invalid!")
            return new Promise<IRoom>((resolve, reject) => {
                socket?.emit(
                    "player-create-room",
                    (ok: boolean, data?: IRoom) => {
                        if (ok) {
                            resolve(data!)
                        } else {
                            reject()
                        }
                    }
                )
            })
        },
        joinRoom: (id: string) => {
            console.assert(socket, "Socket is invalid!")
            return new Promise<void>((resolve, reject) => {
                socket?.emit("player-join-room", id, (ok: boolean) => {
                    if (ok) {
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
        },
        leaveRoom: () => {
            console.assert(socket, "Socket is invalid!")
            socket?.emit("player-leave-room")
            handleMessage("room-leave", {})
        },
        subscribe: (key: string) => {
            console.assert(socket, "Socket is invalid!")
            return new Promise<void>((resolve, reject) => {
                socket?.emit("subscribe", key, (ok: boolean) => {
                    if (ok) {
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
        },
        unsubscribe: (key: string) => {
            console.assert(socket, "Socket is invalid!")
            socket?.emit("unsubscribe", key)
        },
        roomAction: (name: string, data: any) => {
            console.assert(socket, "Socket is invalid!")
            return new Promise<void>((resolve, reject) => {
                socket?.emit(
                    "player-room-action",
                    name as PlayerRoomAction,
                    data,
                    (ok: boolean, reason: string, data: object) => {
                        if (ok) {
                            // handleRoomUpdate()?
                            resolve()
                        } else {
                            reject(reason)
                        }
                    }
                )
            })
        },
        joinGame: (id: string) => {
            console.assert(socket, "Socket is invalid!")
            return new Promise<void>((resolve, reject) => {
                socket?.emit("player-join-game", id, (ok: boolean) => {
                    if (ok) {
                        resolve()
                    } else {
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
        action: (name: PlayerGameAction, data: object = {}) => {
            console.assert(socket, "Socket is invalid!")
            return new Promise<void>((resolve, reject) => {
                console.debug(`Sending ${name}`, data)
                socket?.emit(
                    "player-game-action",
                    name,
                    data,
                    (ok: boolean, reason: string, data: object) => {
                        if (ok) {
                            handleMessage("partial-game-update", data)
                            resolve()
                        } else {
                            reject(reason)
                        }
                    }
                )
            })
        },
    }

    console.log("Socket id", socket?.id)

    return (
        <IOContext.Provider value={contextValue}>{children}</IOContext.Provider>
    )
}

export default IOProvider
