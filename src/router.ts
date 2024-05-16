import { createBrowserRouter } from "react-router-dom"
import Menu from "./Menu"
import SetupGame from "./SetupGame"
import InGame from "./InGame"
import { Overview, SolarSystem } from "./Game"
import { type GameSettings, isDifficulty } from "./Game/types"

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Menu,
    },
    {
        path: "Setup",
        Component: SetupGame,
    },
    {
        path: "Game/*",
        action: async ({ request }): Promise<GameSettings> => {
            const data = await request.formData()

            const difficulty = data.get("difficulty")?.toString()

            return {
                players: Number(data.get("players")?.toString() ?? 1),
                difficulty: isDifficulty(difficulty) ? difficulty : "easy",
            }
        },
        Component: InGame,
        children: [
            {
                index: true,
                Component: SolarSystem,
            },
            {
                path: "Overview",
                Component: Overview,
            },
        ],
    },
])
