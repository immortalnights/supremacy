import Recoil from "recoil"
import { IGame } from "../types.d"

export type { IGame }

export const Game = Recoil.atom<IGame | undefined>({
    key: 'game',
    default: undefined,
})