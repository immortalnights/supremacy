import Recoil from "recoil"
import { IPlayer } from "../types.d"

export interface ClientPlayer extends IPlayer {
  // Is _this_ client this player
  local: boolean
}

export const Player = Recoil.atom<ClientPlayer>({
  key: "player",
  default: {
    id: "",
    name: "",
    ready: false,
    local: true,
  },
})
