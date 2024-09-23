import { createBrowserRouter } from "react-router-dom"
import { Menu, CreateGame } from "./Menu"
import Lobby from "./Lobby/Lobby"
import { routes as gameRoutes } from "./Game/routes"

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
    gameRoutes,
])
