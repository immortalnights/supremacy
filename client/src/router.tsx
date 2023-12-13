import { createBrowserRouter } from "react-router-dom"
import Root from "./Root"
import Browse from "./lobby/Browse"
import Menu from "./screens/Menu"
import Room from "./lobby/Room"
import Game from "./game/Game"

export const router = createBrowserRouter([
    {
        Component: Root,
        children: [
            {
                index: true,
                Component: Menu,
            },
            {
                path: "/browse",
                Component: Browse,
            },
            {
                path: "/room/:id",
                Component: Room,
            },
            {
                path: "/game/:id/*",
                Component: Game,
            },
        ],
    },
])
