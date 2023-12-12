import Recoil from "recoil"
import { ISolarSystem } from "@server/simulation/types"

export type { ISolarSystem }

export const SolarSystem = Recoil.atom<ISolarSystem | undefined>({
    key: "solarsystem",
    default: undefined,
})
