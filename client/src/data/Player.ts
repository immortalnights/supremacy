import Recoil from "recoil"
import { IPlayer } from "../types.d"

export interface IClientPlayer extends IPlayer {
  // Is _this_ client this player
  local: boolean
}

export const Player = Recoil.atom<IClientPlayer>({
  key: "player",
  default: {
    id: "",
    name: "",
    ready: false,
    local: true,
  },
})
