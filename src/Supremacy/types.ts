import type { Planet, Platoon, Ship, ShipClass, ShipPosition } from "./entities"
import type { BotDifficulty } from "./bot/types"

interface Player {
    id: string
    name: string
    host: boolean
    eliminated: boolean
    bot: true | false
}

export interface HumanPlayer extends Player {
    bot: false
}

export interface BotPlayer extends Player {
    bot: true
    difficulty: BotDifficulty
    // Ship ID to a ordered list of actions
    shipOrders: Record<string, BotActionObject[]>
}

export type AnyPlayer = HumanPlayer | BotPlayer

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
    players: AnyPlayer[]
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

export type GameAction = (state: GameState) => GameState

export interface PlanetActions {
    "planet-terraform": { id: string; name?: string }
    "planet-rename": { id: string; name: string }
    "planet-set-tax": { id: string; tax: number }
    "planet-transfer-credits": {
        fromid: string
        toid: string
        amount: number
    }
    "planet-set-aggression": { id: string; aggression: number }
}

export interface ShipActions {
    "ship-purchase": { class: ShipClass; name?: string }
    "ship-crew": { id: string; crew: number }
    "ship-decommission": { id: string }
    "ship-modify-passengers": { id: string; passengers: number }
    "ship-modify-fuel": { id: string; fuel: number }
    "ship-load-cargo": { id: string; cargoType: string; amount: number }
    "ship-unload-cargo": { id: string }
    "ship-reposition": { id: string; destination: ShipPosition }
    "ship-transfer": { id: string; destination: string }
    "ship-toggle": { id: string; active?: boolean }
}

export interface PlatoonActions {
    "platoon-modify-troops": { id: string; troops: number }
    "platoon-modify-suit": { id: string; suitType: string }
    "platoon-modify-weapon": { id: string; weaponType: string }
    "platoon-equip": { id: string; equipment: string }
    "platoon-board-ship": { id: string; shipId: string }
    "platoon-disembark-ship": { id: string; shipId: string }
}

export type Actions = PlanetActions & ShipActions & PlatoonActions

export type Action = keyof Actions

export interface ActionObject<T extends Action = Action> {
    type: T
    payload: Actions[T]
    playerId: string
}

export type ActionPriority = "High" | "Medium" | "Low"

export type BotActionObject = ActionObject & {
    id?: string
    priority: ActionPriority
}
