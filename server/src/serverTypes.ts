import { Socket } from "socket.io"
import {
    ServerToClientEvents,
    ClientToServerEvents,
    IPlayer,
    GameSpeed,
} from "./types"
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
}

export type ServerEventEmitter = TypedEmitter<ServerToResourceEvents>

type UpdateForFn<U> = (id: string) => U

export interface IWorld {
    // Player joining the game
    join: (player: string, ai: boolean, replacedPlayer?: string) => boolean
    // Player leaving the game
    leave: (player: string) => void
    // Get static game data to send to the client after joining
    getStaticData: () => object
    // Handle player in-game action
    dispatch: (
        action: string,
        player: string,
        data: object
    ) => { result: boolean; reason: string; data: object }
    // Simulate the game world
    simulate: (delta: number, speed: GameSpeed) => void
    // Get the game world data for a specific player
    updateFor: UpdateForFn<unknown>
}
