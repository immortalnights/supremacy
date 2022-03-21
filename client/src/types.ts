import * as SimulationTypes from "./simulation/types.d"

// duplicate of server/types.ts until a better way is found
export enum RoomStatus {
  Setup,
  Starting,
  Closed,
}

export enum GameStatus {
  Starting,
  Playing,
  Finished,
  Paused,
  Closed,
}