import { createBrowserRouter } from "react-router-dom"
import Menu from "./Menu"
import CreateGame from "./CreateGame"
import GameRoot from "./GameRoot"
import { Overview, SolarSystem } from "./Game"
import { type GameSettings, isDifficulty } from "./Game/types"
import SetupGame from "./SetupGame"

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Menu,
    },
    {
        path: "Create",
        Component: CreateGame,
    },
    {
        path: "Game/*",
        action: () => true,
        Component: GameRoot,
        children: [
            {
                path: "Setup",
                action: async ({ request }): Promise<GameSettings> => {
                    console.log("ACTION")
                    const data = await request.formData()

                    const difficulty = data.get("difficulty")?.toString()

                    return {
                        players: Number(data.get("players")?.toString() ?? 1),
                        difficulty: isDifficulty(difficulty)
                            ? difficulty
                            : "easy",
                    }
                },
                Component: SetupGame,
            },
            {
                path: "SolarSystem",
                Component: SolarSystem,
            },
            {
                path: "Overview",
                Component: Overview,
            },
        ],
    },
])
