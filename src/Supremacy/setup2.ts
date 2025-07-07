import random, { Random } from "random"
import {
    type ColonizedPlanet,
    type LifelessPlanet,
    type Planet,
    type Platoon,
    type Ship,
    planetTypes,
} from "./entities"
import { throwError } from "./utilities"
import type {
    PlayerAI,
    Difficulty,
    GameConfiguration,
    PlayerConfiguration,
    GameState,
} from "./types"

// Maps the difficulty to the number of planets
const planetsForDifficulty: { [K in Difficulty]: number } = {
    Easy: 8,
    Normal: 16,
    Hard: 32,
    Custom: 8, // TODO
} as const

const difficultyPercentage: { [K in Difficulty]: number } = {
    Easy: 1.2,
    Normal: 1,
    Hard: 0.8,
    Custom: 1, // TODO
} as const

// Generates the other planets, the player capital planets are not included
const generatePlanets = (count: number, rnd: Random) => {
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

// Initializes a capital planet for the player
const initializeCapitalPlanet = (
    owner: string,
    ai: PlayerAI,
    difficulty: Difficulty,
    rnd: Random,
): ColonizedPlanet => {
    const multiplier = ai ? 1 : difficultyPercentage[difficulty]
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

// Initializes empty player platoons
const initializePlatoons = (owner: string, count: number = 24) => {
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

/**
 *
 */
export const setup = (
    config: GameConfiguration,
    player1: PlayerConfiguration,
    player2: PlayerConfiguration,
): GameState => {
    const seed = config.seed ?? crypto.randomUUID()
    const rnd = random.clone()
    rnd.use(seed)

    const planetCount = planetsForDifficulty[config.difficulty]

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
        seed,
        difficulty: config.difficulty,
        date: 1,
        players: [player1, player2],
        planets,
        ships,
        platoons,
    }
}
