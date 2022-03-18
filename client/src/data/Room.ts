import Recoil from "recoil"
import { IRoom } from "../types.d"

export type { IRoom }

export const Room = Recoil.atom<IRoom | undefined>({
  key: "room",
  default: undefined,
})