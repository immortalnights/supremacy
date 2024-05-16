import { Provider } from "jotai"
import { Outlet, useActionData } from "react-router-dom"
import { store, planetsAtom, type Planet } from "./Game/store"
import { GameSettings, type Difficulty } from "./Game/types"

export default function InGame() {
    const settings = useActionData() as GameSettings

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

    return (
        <Provider store={store}>
            <Outlet />
        </Provider>
    )
}
