import React, { useCallback } from "react"
import { io, Socket } from "socket.io-client"
import { PlayerRoomAction } from "@server/types"
import { PlayerGameAction } from "@server/simulation/types"
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
    leaveRoom: () => Promise<void>
    subscribe: (key: string) => Promise<void>
    unsubscribe: (key: string) => Promise<void>
    roomAction: (name: PlayerRoomAction, data: object) => Promise<void>
    joinGame: (id: string) => Promise<void>
    leaveGame: () => Promise<void>
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
    leaveRoom: () => Promise.reject(),
    subscribe: (_key: string) => Promise.reject(),
    unsubscribe: (_key: string) => Promise.reject(),
    roomAction: (_name: PlayerRoomAction, _data: object) => Promise.reject(),
    joinGame: () => Promise.reject(),
    leaveGame: () => Promise.reject(),
    action: (_name: PlayerGameAction, _data: object = {}) => Promise.reject(),
})

export type MessageHandler = (
    action: string,
    data: { key: string; action: string; data: object }
) => void

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

    const handleDisconnect = useCallback(
        (_s: SocketIO) => {
            // don't disconnect the socket manually as doing so
            // prevents auto-reconnecting
            setSocket(undefined)
            // Clean up state
            handleMessage("disconnect", { key: "", action: "", data: {} })
        },
        [handleMessage]
    )

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
    }, [handleMessage, handleDisconnect])

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
        leaveRoom: async () => {
            console.assert(socket, "Socket is invalid!")
            await socket?.emitWithAck("player-leave-room")
            handleMessage("room-leave", { key: "", action: "", data: {} })
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
        unsubscribe: async (_key: string) => {
            console.assert(socket, "Socket is invalid!")
            await socket?.emitWithAck("unsubscribe")
        },
        roomAction: async (name: string, data: object) => {
            console.assert(socket, "Socket is invalid!")

            await socket?.emitWithAck(
                "player-room-action",
                name as PlayerRoomAction,
                data
            )
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
        leaveGame: async () => {
            // console.log("Socket id", socket?.id)
            console.assert(socket, "Socket is invalid!")
            await socket?.emitWithAck("player-leave-game")
            handleMessage("game-player-kicked", {
                key: "",
                action: "",
                data: {},
            })
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
                            handleMessage("partial-game-update", {
                                key: "",
                                action: "",
                                data,
                            })
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
