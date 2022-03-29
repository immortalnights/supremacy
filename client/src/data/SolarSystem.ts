import Recoil from "recoil"
import { ISolarSystem } from "../simulation/types.d"

export type { ISolarSystem }

export const SolarSystem = Recoil.atom<ISolarSystem | undefined>({
    key: "solarsystem",
    default: undefined,
})
