import { useActionData } from "react-router-dom"
import { store, planetsAtom, type Planet, fleetsAtom } from "./Game/store"
import { GameSettings, type Difficulty } from "./Game/types"
import { Navigate } from "react-router-dom"

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
            name: "Unnamed",
        }),
    )

    store.set(planetsAtom, defaultPlanets)
    store.set(fleetsAtom, [])

    return <Navigate to="/Game/SolarSystem" replace />
}
