import Recoil from "recoil"
import { IPlatoon } from "../simulation/types.d"

export type { IPlatoon }

export const Platoons = Recoil.atom<IPlatoon[]>({
    key: 'platoons',
    default: [],
})