import { Planet, Platoon, Ship } from "./entities"

export type GameAction = (state: GameState) => GameState

export type PlayerAI = false | "Easy" | "Normal" | "Hard" | "Elite"

export interface PlayerConfiguration {
    id: string
    name: string
    host: boolean
    ai: PlayerAI
}

export interface GameConfiguration {
    seed?: string
    name: string
    difficulty: Difficulty
}

export interface GameState {
    id: string
    name: string
    seed: string
    difficulty: Difficulty
    date: number
    players: PlayerConfiguration[]
    planets: Planet[]
    ships: Ship[]
    platoons: Platoon[]
    // Turbo is not available to typical players, but used for testing.
    speed: "Paused" | "Slow" | "Normal" | "Fast" | "Turbo"
}

// ---

export const difficulties = ["Easy", "Normal", "Hard", "Custom"] as const
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
