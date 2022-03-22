import Recoil from "recoil"
import { IPlanet, IPlanetBasic } from "../simulation/types.d"

export type { IPlanet, IPlanetBasic }

export const Planets = Recoil.atom<(IPlanetBasic | IPlanet)[]>({
    key: 'planets',
    default: [],
})