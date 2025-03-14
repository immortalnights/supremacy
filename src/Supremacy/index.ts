import random, { Random } from "random"
import {
    type ColonizedPlanet,
    type LifelessPlanet,
    type Planet,
    type Platoon,
    type Ship,
    planetTypes,
} from "./entities"
import { clamp, throwError } from "./utilities"
import { assertNever } from "../utilities"

export type Difficulty = "Easy" | "Normal" | "Hard"
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
    planetCount: number
    difficulty: Difficulty
}

export interface GameState {
    id: string
    name: string
    difficulty: Difficulty
    players: PlayerConfiguration[]
    planets: Planet[]
    ships: Ship[]
    platoons: Platoon[]
}

const difficultyPercentage = (difficulty: Difficulty) => {
    let pc
    switch (difficulty) {
        case "Easy":
            pc = 1.2
            break
        case "Normal":
            pc = 1
            break
        case "Hard":
            pc = 0.8
            break
        default:
            assertNever(difficulty)
    }

    return pc ?? 1
}

/**
 *
 */
export const setup = (
    config: GameConfiguration,
    player1: PlayerConfiguration,
    player2: PlayerConfiguration,
): GameState => {
    const rnd = random.clone()
    rnd.use(config.seed ?? Date.now())

    const planetCount = clamp(config.planetCount, 3, 64)

    const id = crypto.randomUUID()
    const planets: Planet[] = generatePlanets(planetCount, rnd)
    const ships: Ship[] = []
    // Platoons are pre-created for simplicity
    const platoons: Platoon[] = [
        ...initializePlatoons(player1.id),
        ...initializePlatoons(player2.id),
    ]

    const player1Capital = initializeCapitalPlanet(
        player1.id,
        player1.ai,
        config.difficulty,
        rnd,
    )
    player1Capital.name = player1.ai ? "Enemy Base 1" : "Homebase"
    planets.unshift(player1Capital)

    const player2Capital = initializeCapitalPlanet(
        player2.id,
        player2.ai,
        config.difficulty,
        rnd,
    )
    player2Capital.name = player2.ai ? "Enemy Base 2" : "Homebase"
    planets.push(player2Capital)

    return {
        id,
        name: config.name,
        difficulty: config.difficulty,
        players: [player1, player2],
        planets,
        ships,
        platoons,
    }
}

// export const load = (
//     state: GameState,
//     player1: PlayerConfiguration,
//     player2: PlayerConfiguration,
// ): GameState => {}

/**
 *
 */
export const tick = (state: GameState): GameState => {
    return { ...state }
}

// Generates the other planets, the player capital planets are not included
export const generatePlanets = (count: number, rnd: Random) => {
    return Array.from<unknown, LifelessPlanet>({ length: count - 2 }, (_, index) => ({
        id: crypto.randomUUID(),
        gridIndex: 1 + index,
        name: "",
        type: "lifeless",
        terraformedType:
            rnd.choice([...planetTypes]) ??
            throwError("Failed to choose random planet type"),
        terraformDuration: rnd.int(12, 60),
    }))
}

export const initializeCapitalPlanet = (
    owner: string,
    ai: PlayerAI,
    difficulty: Difficulty,
    rnd: Random,
): ColonizedPlanet => {
    const multiplier = ai ? 1 : difficultyPercentage(difficulty)
    const population = rnd.int(1000, 2000) * multiplier
    const credits = rnd.int(50000, 60000) * multiplier
    const food = rnd.int(3000, 5000) * multiplier
    const minerals = rnd.int(2000, 5000) * multiplier
    const fuels = rnd.int(2000, 5000) * multiplier
    const energy = rnd.int(2000, 5000) * multiplier

    return {
        id: crypto.randomUUID(),
        name: "",
        gridIndex: 0,
        type: "metropolis",
        owner: owner,
        capital: true,
        population,
        credits,
        food,
        minerals,
        fuels,
        energy,
        morale: 75,
        growth: 0,
        tax: 25,
        aggression: {
            [owner]: 25,
        },
    }
}

export const initializePlatoons = (owner: string, count: number = 24) => {
    return Array.from<unknown, Platoon>({ length: count }, (_, index) => ({
        id: crypto.randomUUID(),
        index: index,
        owner: owner,
        size: 0,
        calibre: 0,
        state: "standby",
        location: undefined,
        suit: "none",
        weapon: "rifle",
    }))
}
