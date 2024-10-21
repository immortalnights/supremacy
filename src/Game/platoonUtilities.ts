import { atom } from "jotai"
import {
    ColonizedPlanet,
    EquippedPlatoon,
    Planet,
    Platoon,
    Ship,
} from "./entities"
import { platoonsAtom } from "./store"

export const getPlatoonName = (() => {
    const suffixes = new Map([
        ["one", "st"],
        ["two", "nd"],
        ["few", "rd"],
        ["other", "th"],
    ])

    const pr = new Intl.PluralRules("en-US", { type: "ordinal" })
    return (platoon?: EquippedPlatoon) => {
        const value = (platoon?.index ?? 0) + 1
        const rule = pr.select(value)
        const suffix = suffixes.get(rule)
        return platoon ? `${value}${suffix}` : undefined
    }
})()

export function isEquipped(platoon: Platoon): platoon is EquippedPlatoon {
    return platoon.state === "equipped"
}

export function isOnPlanet(
    platoon: Platoon,
    planet?: Planet,
): platoon is EquippedPlatoon {
    return (
        platoon.state === "equipped" &&
        !!platoon.location.planet &&
        platoon.location.planet === planet?.id
    )
}

export function isOnShip(
    platoon: Platoon,
    ship?: Ship,
): platoon is EquippedPlatoon {
    return (
        platoon.state === "equipped" &&
        !!platoon.location.ship &&
        platoon.location.ship === ship?.id
    )
}

export const platoonsOnPlanetAtom = atom((get) => ({
    filter: (planet?: ColonizedPlanet) =>
        get(platoonsAtom).filter((platoon) => isOnPlanet(platoon, planet)),
}))

export const platoonsOnShipAtom = atom((get) => ({
    filter: (ship?: Ship) =>
        get(platoonsAtom).filter((platoon) => isOnShip(platoon, ship)),
}))
