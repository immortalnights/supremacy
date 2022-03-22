import Recoil from "recoil"
import { IUniverse } from "../simulation/types.d"

export type { IUniverse }

export const Universe = Recoil.atom<IUniverse | undefined>({
    key: 'universe',
    default: undefined,
})