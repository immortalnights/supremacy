import Recoil from "recoil"
import { IGame } from "@server/types"

export type { IGame }

export const Game = Recoil.atom<IGame | undefined>({
    key: "game",
    default: undefined,
})
