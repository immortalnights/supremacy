export type PlayerID = string
export type RoomID = string
export type GameID = string

export interface IPlayer {
    id: PlayerID
    name: string
    ready: boolean
}

// Cannot use an enum easily between client and server
export enum RoomStatus {
    Setup,
    Starting,
    Closed,
}

// Maybe should be applied as a generic
export interface IGameOptions {
    seed: string
}

export interface IRoom {
    id: RoomID
    options: IGameOptions
    host: string
    slots: number
    players: IPlayer[]
    status: RoomStatus
    countdown: number
}

export enum GameStatus {
    Starting,
    Playing,
    Paused,
    Finished,
    Closed,
}

const gameSpeeds = ["paused", "slow", "normal", "fast", "ultra"] as const
export type GameSpeed = (typeof gameSpeeds)[number]

export interface IGame {
    id: GameID
    options: IGameOptions
    players: IPlayer[]
    // date/time of last save
    saved: number
    // date/time game was created
    created: number
    status: GameStatus
    speed: GameSpeed
}

export interface IUpdate<T> {
    id: GameID
    // date/time of last save
    saved: number
    // date/time game was created
    created: number
    world: T
}

export interface IActionCallback {
    (ok: boolean, reason: string, data: object): void
}

export type PlayerRoomAction =
    | "toggle-ready"
    | "change-name"
    | "change-room-name"
    | "change-room-seed"
    | "add-ai-player"

// Messages from the client to the Server
export interface ClientToServerEvents {
    connect_error: (...args: unknown[]) => void
    // Player creates a new room (new game), callback true if room is created
    "player-create-room": (
        callback: (ok: boolean, data?: IRoom) => void
    ) => void
    // Player joins an existing room, callback true if joined otherwise false
    "player-join-room": (id: RoomID, callback: (ok: boolean) => void) => void
    // Player changes own state
    "player-room-action": (
        name: PlayerRoomAction,
        data: unknown,
        callback: IActionCallback
    ) => void
    // Player left the room
    "player-leave-room": () => void
    // Host changes game or room options
    "room-set-options": () => void
    // Player subscribes to data (currently rooms)
    subscribe: (key: string, callback: (ok: boolean) => void) => void
    // Player unsubscribes to data
    unsubscribe: (key: string) => void
    // Player joins an existing game, callback true if joined otherwise false
    "player-join-game": (id: GameID, callback: (ok: boolean) => void) => void
    "player-leave-game": () => void
    // Generic game play action
    "player-game-action": (
        name: string,
        data: object,
        callback: IActionCallback
    ) => void
}

// Messages from the server to the client
export interface ServerToClientEvents {
    // Send player ID back to newly connected client
    registered: ({ id }: { id: PlayerID }) => void
    // Send player available rooms
    "room-list": (data: IRoom[]) => void
    // Send room details to the player that has just joined (or created) a room
    "room-joined": (data: IRoom) => void
    // Send new player details to all players within the room
    "room-player-joined": ({
        id,
        name,
        ready,
    }: {
        id: PlayerID
        name: string
        ready: boolean
    }) => void
    // Send leavers details to all other players within the room
    "room-player-left": ({ id }: { id: PlayerID; kicked: boolean }) => void
    // Room updates, settings or start timer
    "room-update": ({
        id,
        options,
    }: {
        id: RoomID
        status: string
        options: IGameOptions
    }) => void
    // Send an update to all players within the room when another player details' have change
    "player-changed": ({
        id,
        name,
        ready,
    }: {
        id: PlayerID
        name: string
        ready: boolean
    }) => void
    "subscription-post": ({
        key,
        action,
        data,
    }: {
        key: string
        action: string
        data: object
    }) => void
    // Notify players of game created by room
    "game-created": (data: IGame) => void
    // Player has joined a game, send details
    "game-joined": (data: IGame) => void
    // New player details to all other players in the game
    "game-player-joined": ({
        id,
        name,
        ready,
    }: {
        id: PlayerID
        name: string
        ready: boolean
    }) => void
    // Send leavers details to all other players in the game
    "game-player-kicked": ({ id }: { id: PlayerID }) => void
    // Static game data required by the client
    "game-static-data": (data: object) => void
    // Send game update to player
    "game-update": (data: IUpdate<unknown>) => void
}
