import { atom, createStore } from "jotai"

export interface Planet {
    id: string
    name: string
}

export const store = createStore()

export const planetsAtom = atom<Planet[]>([])
