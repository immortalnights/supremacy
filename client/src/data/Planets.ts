import Recoil from "recoil"
import { SelectedPlanet as SelectedPlanetID } from "./General"
import { IPlanet, IPlanetBasic } from "../simulation/types.d"

export type { IPlanet, IPlanetBasic }

export const Planets = Recoil.atom<(IPlanetBasic | IPlanet)[]>({
    key: "planets",
    default: [],
})

export const SelectedPlanet = Recoil.selector<IPlanet | undefined>({
    key: "selectedPlanet",
    get: ({ get }) => {
        const id = get(SelectedPlanetID)
        const planets = get(Planets) as IPlanet[]
        return planets.find((planet) => planet.id === id)
    }
})