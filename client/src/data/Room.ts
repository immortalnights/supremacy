import Recoil from "recoil"

export interface IPlayer {
  id: string
  name: string
  ready: boolean
  host: boolean
  // Is _this_ client this player
  local: boolean
}

export interface IRoom {
  id: string
  seed: string
  players: IPlayer[]
  status: string // pending, playing, completed, ?
}

export const Player = Recoil.atom<IPlayer>({
  key: "player",
  default: {
    id: "",
    name: "",
    ready: false,
    host: false,
    local: true,
  },
})

export const Room = Recoil.atom<IRoom | undefined>({
  key: "room",
  default: undefined,
})