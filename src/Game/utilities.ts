import { ColonizedPlanet, Ship } from "./entities"
import { type Difficulty, difficulties } from "./types"

export const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min)
}

export const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value))
}

export const calculateGrowth = ({ morale, tax }: ColonizedPlanet) => {
    return morale * 0.33 - tax * 0.5
}

export function isDifficulty(str: string | undefined): str is Difficulty {
    return !!difficulties.find((item) => str === item)
}

export const shipInLocation = (ships: Ship[], index: number) => {
    return ships.find((ship) => ship.location.index === index)
}
