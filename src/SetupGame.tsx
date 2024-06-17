import { useActionData } from "react-router-dom"
import { store, planetsAtom, fleetsAtom } from "./Game/store"
import { GameSettings, type Difficulty } from "./Game/types"
import { Navigate } from "react-router-dom"
import { Planet } from "./Game/entities"

export default function SetupGame() {
    const settings = useActionData() as GameSettings

    console.log(settings)

    const planetsForDifficulty: { [K in Difficulty]: number } = {
        easy: 8,
        medium: 16,
        hard: 32,
        impossible: 32,
    }

    const defaultPlanets = Array.from<unknown, Planet>(
        { length: planetsForDifficulty[settings.difficulty] },
        (_, index) => ({
            id: String(index),
            name: "",
            gridIndex: index,
        }),
    )

    // EnemyBase (single player)
    defaultPlanets[0] = {
        ...defaultPlanets[0],
        name: "EnemyBase",
        owner: "cpu",
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
        name: "Homebase!",
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

    store.set(planetsAtom, defaultPlanets)
    store.set(fleetsAtom, [])

    return <Navigate to="/Game/SolarSystem" replace />
}
