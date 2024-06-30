import { WritableAtom, atom, createStore } from "jotai"
import { atomWithStorage, createJSONStorage } from "jotai/utils"
import type { Planet, Ship, Platoon } from "./entities"

interface Data {
    planets: Planet[]
}

export const store = createStore()

// The storage is not type safe, there might be a better way to do this to make
// it safe.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storage = createJSONStorage(() => sessionStorage) as any

export const stateAtom = atom<"setup" | "playing" | "paused">("setup")
export const dateAtom = atomWithStorage<number>("date", 0, storage)
export const planetsAtom = atomWithStorage<Planet[]>("planets", [], storage)
const userSelectedPlanetIdAtom = atom<string | undefined>(undefined)
export const selectedPlanetAtom = atom<
    Planet | undefined | Promise<Planet | undefined>
>(
    async (get) => {
        const planetId = get(userSelectedPlanetIdAtom)
        let planets = get(planetsAtom)

        let planet
        if (planets instanceof Promise) {
            planets = await planets
        }

        if (planetId) {
            planet = planets.find((p) => p.id === planetId)
        } else {
            planet = planets.find((p) => p.owner === "local" && p.capital)
        }

        console.debug(planet)
        return planet
    },
    (_get, set, planet) => {
        set(userSelectedPlanetIdAtom, planet.id)
    },
)
export const shipsAtom = atomWithStorage<Ship[]>("ships", [], storage)
export const platoonsAtom = atomWithStorage<Platoon[]>("ships", [], storage)
