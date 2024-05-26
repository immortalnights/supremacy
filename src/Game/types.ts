export const difficulties = ["easy", "medium", "hard", "impossible"] as const

export type Difficulty = (typeof difficulties)[number]

export interface GameSettings {
    players: number
    difficulty: Difficulty
}
