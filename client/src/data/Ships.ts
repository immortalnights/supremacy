import Recoil from "recoil"
import { IShip } from "../simulation/types.d"

export type { IShip }

export const Ships = Recoil.atom<IShip[]>({
    key: 'ships',
    default: [],
})