
export interface IPlayer {
  id: string
  name: string
  // FIXME is this needed, can IRoom->Player not have it there instead?
  ready: boolean
}

// Cannot use an enum easily between client and server
export enum RoomStatus {
  Setup,
  Starting,
  Closed,
}

export interface IRoom {
  id: string
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

export interface IGameOptions {
  seed: string
}

export interface IGame {
  id: string
  players: IPlayer[]
  status: GameStatus
}

// Messages from the client to the Server
export interface ClientToServerEvents {
  "connect_error": (...args: any[]) => void
  // Player creates a new room (new game), callback if room cannot be created
  "player-create-room": (callback: (ok: boolean) => void) => void
  // Player joins an existing room, callback true if joined otherwise false
  "player-join-room": (id: string, callback: (ok: boolean) => void) => void
  // Player changes their ready status
  "player-ready-toggle": () => void
  // Player left the room
  "player-leave-room": () => void
  // Host changes game or room options
  "room-set-options": () => void
  // Player joins an existing game, callback true if joined otherwise false
  "player-join-game": (id: string, callback: (ok: boolean) => void) => void
  "player-leave-game": () => void
}

// Messages from the server to the client
export interface ServerToClientEvents {
  // Send player ID back to newly connected client
  "registered": ({ id }: { id: string }) => void
  // Send room details to the player that has just joined (or created) a room
  "room-joined": (data: IRoom) => void
  // Send new player details to all players within the room
  "room-player-joined": ({ id, name, ready }: { id: string, name: string, ready: boolean }) => void
  // Send leavers details to all other players within the room
  "room-player-left": ({ id }: { id: string }) => void
  // Player has been kicked from the room
  "room-player-kicked": () => void
  // Room updates, settings or start timer
  "room-update": ({ id, options }: { id: string, status: string, options: IGameOptions }) => void
  // Send an update to all players within the room when another players ready state has changed
  "player-ready-status-changed": ({ id, ready }: { id: string, ready: boolean }) => void
  // Notify players of game created by room
  "game-created": (data: IGame) => void
  // Player has joined a game, send details
  "game-joined": (data: IGame) => void
  // New player details to all other players in the game
  "game-player-joined": ({ id, name, ready }: { id: string, name: string, ready: boolean }) => void
  // Send leavers details to all other players in the game
  "game-player-kicked": ({ id }: { id: string }) => void
}