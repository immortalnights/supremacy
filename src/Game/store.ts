import { atom, createStore } from "jotai"
import type { Planet, Ship, Platoon } from "./entities"
import { GameSession } from "./types"

export const store = createStore()

export const stateAtom = atom<"setup" | "playing" | "paused">("setup")
export const sessionAtom = atom<GameSession>({
    id: "",
    host: false,
    difficulty: "easy",
    multiplayer: false,
    localPlayer: "unknown",
    player1: { id: "unknown", name: "unknown" },
    player2: { id: "unknown", name: "unknown" },
})
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
            planets = await planets
        }

        if (planetId) {
            planet = planets.find((p) => p.id === planetId)
            console.debug("User selected planet", planetId, planet)
        } else {
            planet = planets.find((p) => p.owner === localPlayer && p.capital)
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
