import Recoil from "recoil"
import { PlatoonStatus } from "../simulation/types"
import {
    PlanetID,
    IPlatoon,
    IPlatoonBasic,
    ShipID,
} from "../simulation/types.d"
import { Player } from "./Player"

export type { IPlatoon, IPlatoonBasic }

const sumPlatoonStrengths = (platoons: IPlatoonBasic[]) =>
    platoons.reduce((value, p, index, arr) => value + p.strength, 0)

export const Platoons = Recoil.atom<(IPlatoon | IPlatoonBasic)[]>({
    key: "platoons",
    default: [],
})

export const PlayerPlatoons = Recoil.selector<IPlatoon[]>({
    key: "playerPlatoons",
    get: ({ get }) => {
        const player = get(Player)
        const platoons = get(Platoons) as IPlatoon[]
        return platoons.filter((p) => p.owner === player.id)
    },
})

export const PlatoonsOnPlanet = Recoil.selectorFamily<
    IPlatoonBasic[],
    { planet: PlanetID }
>({
    key: "platoonsOnPlanet",
    get:
        ({ planet }) =>
        ({ get }) => {
            const player = get(Player)
            const platoons = get(Platoons)
            return platoons.filter(
                (p) =>
                    p.status === PlatoonStatus.Recruited &&
                    p.location.planet === planet &&
                    p.owner === player.id
            )
        },
})

export const PlanetStrength = Recoil.selectorFamily<
    number,
    { planet: PlanetID }
>({
    key: "planetStrength",
    get:
        ({ planet }) =>
        ({ get }) => {
            const platoons = get(PlatoonsOnPlanet({ planet: planet }))
            return sumPlatoonStrengths(platoons)
        },
})

export const PlanetEnemyStrength = Recoil.selectorFamily<
    number,
    { planet: PlanetID }
>({
    key: "planetEnemyStrength",
    get:
        ({ planet }) =>
        ({ get }) => {
            const player = get(Player)
            const platoons = get(Platoons).filter(
                (p) =>
                    p.status === PlatoonStatus.Recruited &&
                    p.location.planet === planet &&
                    p.owner !== player.id
            )
            return sumPlatoonStrengths(platoons)
        },
})

export const PlatoonsOnShip = Recoil.selectorFamily<
    IPlatoonBasic[],
    { ship: ShipID | undefined }
>({
    key: "platoonsOnShip",
    get:
        ({ ship }) =>
        ({ get }) => {
            const player = get(Player)
            const platoons = get(Platoons)
            return platoons.filter(
                (p) =>
                    p.status === PlatoonStatus.Recruited &&
                    ship !== undefined &&
                    p.location.ship === ship &&
                    p.owner === player.id
            )
        },
})
