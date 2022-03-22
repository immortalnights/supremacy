import Recoil from "recoil"
import { IPlayer } from "../types.d"

export type { IPlayer }

export interface ILocalPlayer extends IPlayer {
  // Is _this_ client this player
  local: boolean
}

export const Player = Recoil.atom<ILocalPlayer>({
  key: "player",
  default: {
    id: "",
    name: "",
    ready: false,
    local: true,
  },
})
