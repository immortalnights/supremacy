export const difficulties = <const>["easy", "medium", "hard", "impossible"]

export type Difficulty = (typeof difficulties)[number]

export interface GameSettings {
    players: number
    difficulty: Difficulty
}

export function isDifficulty(str: string | undefined): str is Difficulty {
    return !!difficulties.find((item) => str === item)
}
