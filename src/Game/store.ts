import { atom, createStore } from "jotai"
import { atomWithStorage, createJSONStorage } from "jotai/utils"
import type { Planet, Ship, Platoon } from "./entities"

const findCapital = (planets: Planet[], owner: string) =>
    planets.find((planet) => planet.owner === owner && planet.capital)

interface Data {
    planets: Planet[]
}

export const store = createStore()

// The storage is not type safe, there might be a better way to do this to make
// it safe.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storage = createJSONStorage(() => sessionStorage) as any

export const dateAtom = atomWithStorage<number>("date", 0, storage)
export const planetsAtom = atomWithStorage<Planet[]>("planets", [], storage)
export const selectedPlanetAtom = atom<
    Planet | undefined | Promise<Planet | undefined>
>((get) => {
    const planets = get(planetsAtom)
    let result
    if (planets instanceof Promise) {
        result = planets.then((planets) => findCapital(planets, "local"))
    } else {
        result = findCapital(planets, "local")
    }

    return result
})
export const shipsAtom = atomWithStorage<Ship[]>("ships", [], storage)
export const platoonsAtom = atomWithStorage<Platoon[]>("ships", [], storage)
