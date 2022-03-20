import { Socket } from "socket.io"
import { ServerToClientEvents, ClientToServerEvents, IPlayer } from "./types"
import TypedEmitter from "typed-emitter"

export type SocketIO = Socket<ClientToServerEvents, ServerToClientEvents>

// Events to or from Player, Room, etc
interface ServerToResourceEvents {
  // Required by TypedEmitter.EventMap
  [index: string]: (...args: any[]) => void

  // Player wants to create a new room
  "player-create-room": (player: IPlayer) => void
  // Player wants to join an existing room
  "player-join-room": (player: IPlayer, id: string) => void
  // Room is empty; delete it
  "room-cleanup": (id: string) => void
}

export type ServerEventEmitter = TypedEmitter<ServerToResourceEvents>