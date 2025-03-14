import { atom } from "jotai"
import { shipsAtom } from "Game/store"
import {
    ColonizedPlanet,
    Planet,
    Ship,
    ShipDocked,
    ShipInOrbit,
    ShipInOuterSpace,
    ShipOnSurface,
    ShipPosition,
} from "Game/entities"
import { DAYS_PER_YEAR } from "Game/settings"

export const transitionMatrix: { [key in ShipPosition]: ShipPosition[] } = {
    // From : To
    orbit: ["docked", "outer-space"],
    surface: ["docked"],
    docked: ["surface", "orbit"],
    "outer-space": ["orbit"],
}

export const canPurchaseAtmos = (date: number, owned: number) => {
    let available = true
    if (date < 5) {
        // DAYS_PER_YEAR) {
        available = false
        console.error(`Cannot purchase Atmosphere Processor yet (${date})`)
    } else if (owned > 0) {
        available = false
        console.error("Cannot own more than one Atmosphere Processor")
    }
    return available
}

// Return ships in outer space.
export const isInOuterSpace = (ship: Ship): ship is ShipInOuterSpace => {
    return ship.position === "outer-space"
}

export const shipsInOuterSpaceAtom = atom((get) => ({
    filter: () => get(shipsAtom).filter((ship) => isInOuterSpace(ship)),
}))

// Return ships in orbit of the specified planet.
export const isOrbitingPlanet = (ship: Ship, planet: Planet): ship is ShipInOrbit => {
    return (
        ship.position === "orbit" &&
        !!ship.location.planet &&
        ship.location.planet === planet.id
    )
}

export const shipsOrbitingPlanetAtom = atom((get) => ({
    filter: (planet?: Planet) => {
        const ships = planet
            ? get(shipsAtom).filter((ship) => isOrbitingPlanet(ship, planet))
            : []

        return ships
    },
}))

// Return ships in the specified planet docking bays.
export const isDocketAtPlanet = (ship: Ship, planet: Planet): ship is ShipDocked => {
    return (
        ship.position === "docked" &&
        !!ship.location.planet &&
        ship.location.planet === planet.id
    )
}

export const shipsDocketAtPlanetAtom = atom((get) => ({
    filter: (planet?: ColonizedPlanet, owner?: string, sort = true) => {
        const ships = planet
            ? get(shipsAtom).filter(
                  (ship) =>
                      isDocketAtPlanet(ship, planet) &&
                      (!owner || ship.owner === owner),
              )
            : []

        if (sort) {
            ships.sort((a, b) => a.location.index - b.location.index)
        }

        return ships
    },
}))

// Return ships on the surface of the specified planet.
export const isOnPlanetSurface = (
    ship: Ship,
    planet: Planet,
): ship is ShipOnSurface => {
    return (
        ship.position === "surface" &&
        !!ship.location.planet &&
        ship.location.planet === planet.id
    )
}

export const shipsOnPlanetSurfaceAtom = atom((get) => ({
    filter: (planet?: ColonizedPlanet, owner?: string, sort = true) => {
        const ships = planet
            ? get(shipsAtom).filter(
                  (ship) =>
                      isOnPlanetSurface(ship, planet) &&
                      (!owner || ship.owner === owner),
              )
            : []

        if (sort) {
            ships.sort((a, b) => a.location.index - b.location.index)
        }

        return ships
    },
}))
