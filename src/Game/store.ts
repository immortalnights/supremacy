import { atom, createStore } from "jotai"
import type { Planet, Ship, Platoon, ColonizedPlanet } from "Supremacy/entities"
import { isOnPlanet, isOnShip } from "Supremacy/platoons"
import {
    isDocketAtPlanet,
    isInOuterSpace,
    isOnPlanetSurface,
    isOrbitingPlanet,
} from "Supremacy/ships"
import { GameSession } from "Supremacy/types"

export const store = createStore()

export const simulationSpeedAtom = atom<"slow" | "paused" | "normal" | "fast">("paused")
export const sessionAtom = atom<GameSession | undefined>(undefined)
export const dateAtom = atom<number>(0)
export const planetsAtom = atom<Planet[]>([])
const userSelectedPlanetIdAtom = atom<string | undefined>(undefined)
export const selectedPlanetAtom = atom<
    Planet | undefined | Promise<Planet | undefined>
>(
    async (get) => {
        const { localPlayer } = get(sessionAtom)
        const planetId = get(userSelectedPlanetIdAtom)
        let planets = get(planetsAtom)

        let planet
        if (planets instanceof Promise) {
            console.debug("waiting for planets!")
            planets = await planets
        }

        if (planetId) {
            planet = planets.find((p) => p.id === planetId)
            // console.debug("User selected planet", planetId, planet)
        } else {
            planet = planets.find(
                (p) => p.type !== "lifeless" && p.owner === localPlayer && p.capital,
            )
            // console.debug("Default selected planet", planet)
        }

        return planet
    },
    (_get, set, planet) => {
        console.debug("User selected planet", planet.id)
        set(userSelectedPlanetIdAtom, planet.id)
    },
)
export const shipsAtom = atom<Ship[]>([])
export const platoonsAtom = atom<Platoon[]>([])

export const shipsInOuterSpaceAtom = atom((get) => ({
    filter: () => get(shipsAtom).filter((ship) => isInOuterSpace(ship)),
}))

export const shipsOrbitingPlanetAtom = atom((get) => ({
    filter: (planet?: Planet) => {
        const ships = planet
            ? get(shipsAtom).filter((ship) => isOrbitingPlanet(ship, planet))
            : []

        return ships
    },
}))

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

export const platoonsOnPlanetAtom = atom((get) => ({
    filter: (planet?: ColonizedPlanet, owner?: string) =>
        planet
            ? get(platoonsAtom).filter(
                  (platoon) =>
                      isOnPlanet(platoon, planet) &&
                      (!owner || platoon.owner === owner),
              )
            : [],
}))

export const platoonsOnShipAtom = atom((get) => ({
    filter: (ship?: Ship) =>
        ship ? get(platoonsAtom).filter((platoon) => isOnShip(platoon, ship)) : [],
}))
