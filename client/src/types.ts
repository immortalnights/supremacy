import * as SimulationTypes from "./simulation/types.d"

// duplicate of server/types.ts until a better way is found
export enum RoomStatus {
  Setup,
  Starting,
  Playing,
  Complete,
  Closed,
}