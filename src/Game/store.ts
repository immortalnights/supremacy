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

export const planetsAtom = atomWithStorage<Planet[]>("planets", [], storage)
export const selectedPlanetAtom = atom<
    Planet | undefined | Promise<Planet | undefined>
>((get) => {
    const val = get(planetsAtom)
    let result
    if (val instanceof Promise) {
        result = val.then((planets) => findCapital(planets, "local"))
    } else {
        result = findCapital(val, "local")
    }

    return result
})
export const fleetsAtom = atomWithStorage<Ship[]>("ships", [], storage)
export const platoonsAtom = atomWithStorage<Platoon[]>("ships", [], storage)
