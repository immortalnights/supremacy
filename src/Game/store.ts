import { atom, createStore } from "jotai"
import type { Planet, Ship, Platoon } from "./entities"
import { GameSession } from "./types"

export const store = createStore()

export const simulationSpeedAtom = atom<"slow" | "paused" | "normal" | "fast">(
    "paused",
)
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
            console.debug("User selected planet", planetId, planet)
        } else {
            planet = planets.find(
                (p) =>
                    p.type !== "lifeless" &&
                    p.owner === localPlayer &&
                    p.capital,
            )
            console.debug("Default selected planet", planet)
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
