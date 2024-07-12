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
import { Difficulty, GameConfiguration } from "./Game/types"
import GameSetup from "./GameSetup"
import { isDifficulty } from "./Game/utilities"
import Lobby from "./Lobby"
// import GameRoom from "./GameRoom"
import { GameSimulation } from "./GameSimulation"
import GameSessionBoundary from "./GameSessionBoundry"

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
        // jotai provider is here
        Component: GameRoot,
        children: [
            {
                path: "Setup",
                // Keep the form handling simply and pass through the data to the Component
                action: async ({ request }): Promise<GameConfiguration> => {
                    const data = await request.formData()

                    return {
                        difficulty: data
                            .get("difficulty")
                            ?.toString() as Difficulty,
                        multiplayer:
                            data.get("multiplayer")?.toString() === "true",
                        planets: Number(data.get("planets")?.toString()),
                        player1Id: crypto.randomUUID(),
                        player1Name:
                            data.get("player1Name")?.toString() ?? "noname",
                        player2Id: data.get("player2Id")?.toString(),
                        player2Name: data.get("player2Name")?.toString(),
                    }
                },
                Component: GameSetup,
            },
            {
                path: ":id",
                // Simulation is here
                Component: GameSimulation,
                ErrorBoundary: GameSessionBoundary,
                children: [
                    {
                        index: true,
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
