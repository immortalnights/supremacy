import Recoil from "recoil"
import { SelectedPlanetID } from "./General"
import { IPlayer, Player } from "./Player"
import type { PlanetID, IPlanet, IPlanetBasic } from "@server/simulation/types"

export type { IPlanet, IPlanetBasic }

export const Planets = Recoil.atom<(IPlanetBasic | IPlanet)[]>({
    key: "Planets",
    default: [],
})

export const PlayerPlanets = Recoil.selector<IPlanet[]>({
    key: "PlayerPlanets",
    get: ({ get }) => {
        const player = get(Player) as IPlayer
        const planets = get(Planets)
        return planets.filter((p) => p.owner === player.id) as IPlanet[]
    },
})

export const Planet = Recoil.selectorFamily<
    IPlanetBasic | IPlanet | undefined,
    PlanetID | undefined
>({
    key: "Planet",
    get:
        (id: PlanetID | undefined) =>
        ({ get }) => {
            const planets = get(Planets) as (IPlanetBasic | IPlanet)[]
            return planets.find((p) => p.id === id)
        },
})

// Used to remember plant selection after navigation
export const SelectedPlanet = Recoil.selector<IPlanet | undefined>({
    key: "SelectedPlanet",
    get: ({ get }) => {
        const id = get(SelectedPlanetID)
        const planets = get(Planets) as IPlanet[]
        return planets.find((planet) => planet.id === id)
    },
})

export const CapitalPlanet = Recoil.selector<IPlanet>({
    key: "CapitalPlanet",
    get: ({ get }) => {
        const player = get(Player) as IPlayer
        const planets = get(Planets) as IPlanet[]
        return planets.find(
            (p) => p.owner === player.id && p.capital === true
        ) as IPlanet
    },
})
