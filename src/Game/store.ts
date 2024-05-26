import { createStore } from "jotai"
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

export const planetsAtom = atomWithStorage<Planet[]>("planets", [], storage)
export const fleetsAtom = atomWithStorage<Ship[]>("ships", [], storage)
export const platoonsAtom = atomWithStorage<Platoon[]>("ships", [], storage)
