import { Ship } from "./entities"
import { type Difficulty, difficulties } from "./types"

export function isDifficulty(str: string | undefined): str is Difficulty {
    return !!difficulties.find((item) => str === item)
}

export const shipInLocation = (ships: Ship[], index: number) => {
    return ships.find((ship) => ship.location.index === index)
}
