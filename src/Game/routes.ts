import { RouteObject } from "react-router-dom"
import { Difficulty, GameConfiguration } from "./types"
import GameSetup from "./GameSetup"
import { GameSimulation } from "./GameSimulation"
import GameSessionBoundary from "./GameSessionBoundary"
import Cargo from "./Cargo"
import Combat from "./Combat"
import Fleet from "./Fleet"
import GameRoot from "./GameRoot"
import Overview from "./Overview"
import Shipyard from "./Shipyard"
import SolarSystem from "./SolarSystem"
import Surface from "./Surface"
import Training from "./Training"

export const routes = {
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
                    multiplayer: data.get("multiplayer")?.toString() === "true",
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
} satisfies RouteObject
