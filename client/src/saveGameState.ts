import Recoil from "recoil"

type State = "pending" | "idle" | "saving"

export interface ISaveGameState {
  state: State,
  lastSaved: number
}

export const saveGameState = Recoil.atom({
  key: "saveGameState",
  default: {
    state: "idle",
    lastSaved: 0,
  }
})