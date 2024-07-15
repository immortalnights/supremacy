import { Planet, Platoon, Ship } from "./entities"

export const difficulties = ["easy", "medium", "hard", "impossible"] as const

export type Difficulty = (typeof difficulties)[number]

export interface GameData {
    planets: Planet[]
    ships: Ship[]
    platoons: Platoon[]
}

export interface PlayerInfo {
    id: string
    name: string
}

export interface GameConfiguration {
    difficulty: Difficulty
    planets: number
    multiplayer: boolean
    player1Id: string
    player1Name: string
    player2Id: string | undefined
    player2Name: string | undefined
}

export interface GameSession {
    id: string
    multiplayer: boolean
    host: boolean
    difficulty: Difficulty
    created: string
    playtime: number
    // ID of the local player
    localPlayer: string
    player1: PlayerInfo
    player2: PlayerInfo | undefined
}

export interface SaveGameData extends GameData {
    session: GameSession
    speed: string
}
export interface LastSaveData {
    id: string
    multiplayer: boolean
    planets: number
    started: string
    playtime: number
    playerName: string
}
