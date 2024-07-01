export const difficulties = ["easy", "medium", "hard", "impossible"] as const

export type Difficulty = (typeof difficulties)[number]

export interface PlayerInfo {
    id: string
    name: string
}

export interface GameSettings {
    id: string | undefined
    host: boolean
    difficulty: Difficulty
    multiplayer: boolean
    player1: PlayerInfo
    player2: PlayerInfo
}
