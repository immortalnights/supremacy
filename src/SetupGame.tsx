import { useActionData } from "react-router-dom"
import {
    store,
    stateAtom,
    dateAtom,
    planetsAtom,
    shipsAtom,
    platoonsAtom,
} from "./Game/store"
import { GameSettings, type Difficulty } from "./Game/types"
import { Navigate } from "react-router-dom"
import { Planet } from "./Game/entities"

export default function SetupGame() {
    const settings = useActionData() as GameSettings
    console.log(settings)

    // This is a poor check, but it works until the mp system is improved
    const isMultiplayer = !settings?.difficulty
    const difficulty = settings?.difficulty ?? "easy"

    const planetsForDifficulty: { [K in Difficulty]: number } = {
        easy: 8,
        medium: 16,
        hard: 32,
        impossible: 32,
    }

    const defaultPlanets = Array.from<unknown, Planet>(
        { length: planetsForDifficulty[difficulty] },
        (_, index) => ({
            id: String(index),
            name: "",
            gridIndex: index,
        }),
    )

    // EnemyBase (single player)
    defaultPlanets[0] = {
        ...defaultPlanets[0],
        name: isMultiplayer ? "Player2" : "EnemyBase",
        owner: isMultiplayer ? "remote" : "cpu",
        capital: true,
        credits: 1000,
        food: 1000,
        minerals: 1000,
        fuels: 1000,
        energy: 1000,
        population: 1000,
        growth: 0,
        moral: 0,
        tax: 10,
    }

    const lastPlanet = defaultPlanets[defaultPlanets.length - 1]
    defaultPlanets[defaultPlanets.length - 1] = {
        ...lastPlanet,
        name: isMultiplayer ? "Player1" : "Homebase!",
        owner: "local",
        capital: true,
        credits: 1000,
        food: 1000,
        minerals: 1000,
        fuels: 1000,
        energy: 1000,
        population: 1000,
        growth: 0,
        moral: 0,
        tax: 10,
    }

    store.set(stateAtom, "playing")
    store.set(dateAtom, 0)
    store.set(planetsAtom, defaultPlanets)
    store.set(shipsAtom, [])
    store.set(platoonsAtom, [])

    return <Navigate to="/Game/SolarSystem" replace />
}
