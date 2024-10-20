import {
    Planet,
    LifelessPlanet,
    ColonizedPlanet,
    PlanetResources,
    Platoon,
    Ship,
} from "./entities"
import {
    Difficulty,
    GameData,
    GameSession,
    LastSaveData,
    SaveGameData,
} from "./types"
import { random } from "./utilities"

const planetsForDifficulty: { [K in Difficulty]: number } = {
    easy: 8,
    medium: 16,
    hard: 32,
    impossible: 32,
} as const

const initialPlanetPopulation = (difficulty: Difficulty, ai: boolean) =>
    random(1000, 2000)

const initialPlanetCredits = (difficulty: Difficulty, ai: boolean) =>
    random(50000, 60000)

const initialPlanetResources = (
    difficulty: Difficulty,
    ai: boolean,
): PlanetResources => {
    return {
        food: random(3000, 5000),
        minerals: random(2000, 5000),
        fuels: random(2000, 5000),
        energy: random(2000, 5000),
    }
}

const initializeCapitalPlanet = (
    name: string,
    owner: string,
    index: number,
    population: number,
    credits: number,
    resources: PlanetResources,
): ColonizedPlanet => {
    return {
        id: crypto.randomUUID(),
        gridIndex: index,
        name,
        type: "metropolis",
        owner: owner,
        capital: true,
        population,
        credits,
        ...resources,
        morale: 75,
        growth: 0,
        tax: 25,
        aggression: {
            [owner]: 25,
        },
    }
}

const initializeAICapitalPlanet = (difficulty: Difficulty) =>
    initializeCapitalPlanet(
        "Enemybase!",
        "AI",
        0,
        initialPlanetPopulation(difficulty, true),
        initialPlanetCredits(difficulty, true),
        initialPlanetResources(difficulty, true),
    )

const generatePlanets = (count: number): Planet[] =>
    Array.from<unknown, LifelessPlanet>({ length: count - 2 }, (_, index) => ({
        id: String(1 + index),
        gridIndex: 1 + index,
        name: "",
        type: "lifeless",
    }))

const initializePlatoons = (playerId: string, count: number = 24) =>
    Array.from<unknown, Platoon>({ length: count }, (_, index) => ({
        id: crypto.randomUUID(),
        index: index,
        owner: playerId,
        size: 0,
        calibre: 0,
        state: "standby",
        location: undefined,
        suit: "none",
        weapon: "rifle",
    }))

export const initializeSinglePlayerGame = (
    difficulty: Difficulty,
    planetCount: number,
    playerId: string,
): GameData => {
    const defaultPlanets = generatePlanets(planetCount)

    defaultPlanets.unshift(initializeAICapitalPlanet(difficulty))
    defaultPlanets.push(
        initializeCapitalPlanet(
            "Homebase!",
            playerId,
            planetCount - 1,
            initialPlanetPopulation(difficulty, true),
            initialPlanetCredits(difficulty, true),
            initialPlanetResources(difficulty, true),
        ),
    )

    return {
        planets: defaultPlanets,
        ships: [],
        platoons: [
            ...initializePlatoons(playerId),
            /*todo AI platoons*/
        ],
    }
}

export const initializeMultiplayerGame = (
    difficulty: Difficulty,
    planetCount: number,
    player1Id: string,
    player2Id: string,
): GameData => {
    const defaultPlanets = generatePlanets(planetCount)
    const population = initialPlanetPopulation(difficulty, true)
    const credits = initialPlanetCredits(difficulty, true)
    const resources = initialPlanetResources(difficulty, false)

    defaultPlanets.unshift(
        initializeCapitalPlanet(
            "Homebase!",
            player2Id,
            0,
            population,
            credits,
            resources,
        ),
    )
    defaultPlanets.push(
        initializeCapitalPlanet(
            "Homebase!",
            player1Id,
            planetCount - 1,
            population,
            credits,
            resources,
        ),
    )

    return {
        planets: defaultPlanets,
        ships: [],
        platoons: [
            ...initializePlatoons(player1Id),
            ...initializePlatoons(player2Id),
        ],
    }
}

export const loadSavedGame = (id: string) => {
    const data = localStorage.getItem(id)
    let savedGame

    if (data) {
        savedGame = JSON.parse(data) as SaveGameData
        // Sanity checks!
    }

    return savedGame
}

export const saveGame = (
    session: GameSession,
    speed: string,
    planets: Planet[],
    ships: Ship[],
    platoons: Platoon[],
) => {
    const saveGameData = {
        session,
        speed,
        planets,
        ships,
        platoons,
    } satisfies SaveGameData

    const saveId = crypto.randomUUID()
    localStorage.setItem(saveId, JSON.stringify(saveGameData))
    localStorage.setItem(
        "last-save",
        JSON.stringify({
            id: saveId,
            multiplayer: session.multiplayer,
            planets: planets.length,
            started: session.created,
            playtime: session.playtime,
            playerName: session.player1.name,
        } satisfies LastSaveData),
    )
    console.info("Saved game", saveId)
}
