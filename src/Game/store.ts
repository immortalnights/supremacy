import { atom, createStore } from "jotai"
import type { Planet, Ship, Platoon } from "./entities"

export const store = createStore()

export const stateAtom = atom<"setup" | "playing" | "paused">("setup")
export const dateAtom = atom<number>(0)
export const planetsAtom = atom<Planet[]>([])
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
export const shipsAtom = atom<Ship[]>([])
export const platoonsAtom = atom<Platoon[]>([])
