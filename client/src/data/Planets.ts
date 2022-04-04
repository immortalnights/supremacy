import Recoil from "recoil"
import { SelectedPlanet as SelectedPlanetID } from "./General"
import { IPlayer, Player } from "./Player"
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

export const CapitalPlanet = Recoil.selector<IPlanet | undefined>({
    key: "capitalPlanet",
    get: ({ get }) => {
        const player = get(Player) as IPlayer
        const planets = get(Planets) as IPlanet[]
        return planets.find((p) => p.owner === player.id && p.capital === true)
    }
})