import { createBrowserRouter } from "react-router-dom"
import Menu from "./Menu"
import CreateGame from "./CreateGame"
import GameRoot from "./GameRoot"
import {
    Overview,
    Shipyard,
    SolarSystem,
    Fleet,
    Combat,
    Cargo,
    Surface,
    Training,
} from "./Game"
import { type GameSettings } from "./Game/types"
import GameSetup from "./GameSetup"
import { isDifficulty } from "./Game/utilities"
import Lobby from "./Lobby"
import GameRoom from "./GameRoom"
import { GameSimulation } from "./GameSimulation"

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
        path: "Lobby/*",
        Component: Lobby,
        // children: [
        //     {
        //         path: "Room/:room",
        //         Component: GameRoom,
        //     },
        // ],
    },
    {
        path: "Game/*",
        action: () => true,
        Component: GameRoot,
        children: [
            {
                path: "Setup",
                action: async ({ request }): Promise<GameSettings> => {
                    const data = await request.formData()

                    const difficulty = data.get("difficulty")?.toString()

                    return {
                        id: undefined,
                        host: true,
                        multiplayer:
                            Number(data.get("players")?.toString() ?? 1) > 1,
                        difficulty: isDifficulty(difficulty)
                            ? difficulty
                            : "easy",
                        player1: {
                            id: "local",
                            name: "Local Player",
                        },
                        player2: {
                            id: "cpu",
                            name: "AI Player",
                        },
                    }
                },
                Component: GameSetup,
            },
            {
                path: ":id",
                Component: GameSimulation,
                children: [
                    {
                        path: "SolarSystem",
                        Component: SolarSystem,
                    },
                    {
                        path: "Overview",
                        Component: Overview,
                    },
                    {
                        path: "Shipyard",
                        Component: Shipyard,
                    },
                    {
                        path: "Fleet",
                        Component: Fleet,
                    },
                    {
                        path: "Combat",
                        Component: Combat,
                    },
                    {
                        path: "Cargo",
                        Component: Cargo,
                    },
                    {
                        path: "Surface",
                        Component: Surface,
                    },
                    {
                        path: "Training",
                        Component: Training,
                    },
                ],
            },
        ],
    },
])
