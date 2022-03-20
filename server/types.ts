
// Cannot use an enum easilly between client and server
export enum RoomStatus {
  Setup,
  Starting,
  Playing,
  Complete,
  Closed,
}

export interface IRoomOptions {
  seed: string
  countdown: number
}

export interface IRoom {
  id: string
  options: IRoomOptions
  host: string
  slots: number
  players: IPlayer[]
  status: RoomStatus
}

export interface IPlayer {
  id: string
  name: string
  // FIXME is this needed, can IRoom->Player not have it there instead?
  ready: boolean
}

// Messages from the client to the Server
export interface ClientToServerEvents {
  "connect_error": (...args: any[]) => void
  // Player creates a new room (new game), callback if room cannot be created
  "room-create": (callback: (ok: boolean) => void) => void
  // Player joins an existing room, callback if room cannot be joined
  "room-join": (id: string, callback: (ok: boolean) => void) => void
  // Player leaves
  "room-leave": () => void
  "room-set-options": () => void
  "player-ready-toggle": () => void
  "create-game": () => void
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
  // Player has been kicked from the room, sent to specific players (or if the host leaves, all players)
  "room-player-kicked": () => void
  // Room updates, settings or start timer
  "room-update": ({ id, options }: { id: string, status: string, options: IRoomOptions }) => void
  // Send an update to all players within the room when another players ready state has changed
  "player-ready-status-changed": ({ id, ready }: { id: string, ready: boolean }) => void
}