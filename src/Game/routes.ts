import { RouteObject } from "react-router-dom"
import { Difficulty, GameConfiguration } from "Supremacy/types"
import GameSetup from "./GameSetup"
import { GameSimulation } from "./GameSimulation"
import GameSessionBoundary from "./GameSessionBoundary"
import GameRoot from "./components/Root"
import Cargo from "./Screens/Cargo"
import Combat from "./Screens/Combat"
import Fleet from "./Screens/Fleet"
import Overview from "./Screens/Overview"
import Shipyard from "./Screens/Shipyard"
import SolarSystem from "./Screens/SolarSystem"
import Surface from "./Screens/Surface"
import Training from "./Screens/Training"
import {
    AuthenticationWithRedirect,
    Authentication,
    CombatAuthentication,
} from "./components/Authentication"

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
                    difficulty: data.get("difficulty")?.toString() as Difficulty,
                    multiplayer: data.get("multiplayer")?.toString() === "true",
                    planets: Number(data.get("planets")?.toString()),
                    player1Id: crypto.randomUUID(),
                    player1Name: data.get("player1Name")?.toString() ?? "noname",
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
                    path: "Shipyard",
                    Component: Shipyard,
                },
                {
                    path: "Training",
                    Component: Training,
                },

                {
                    Component: AuthenticationWithRedirect,
                    children: [
                        {
                            path: "Overview",
                            Component: Overview,
                        },
                    ],
                },

                {
                    Component: Authentication,
                    children: [
                        {
                            path: "Overview",
                            Component: Overview,
                        },
                        {
                            path: "Fleet",
                            Component: Fleet,
                        },
                        {
                            path: "Surface",
                            Component: Surface,
                        },
                        {
                            path: "Cargo",
                            Component: Cargo,
                        },
                    ],
                },

                {
                    Component: CombatAuthentication,
                    children: [
                        {
                            path: "Combat",
                            Component: Combat,
                        },
                    ],
                },
            ],
        },
    ],
} satisfies RouteObject
