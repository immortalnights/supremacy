import React from "react"
import ReactDOM from "react-dom/client"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import "./index.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import Browse from "./lobby/Browse"
import Menu from "./screens/Menu"
import Room from "./lobby/Room"
import Game from "./game/Game"
import DataProvider from "./data/DataProvider"
import { IOContext } from "./data/IOContext"

const theme = createTheme()

const Root = () => {
    const { connected } = React.useContext(IOContext)

    return (
        <div>
            {connected ? "Connected" : "Not Connected"}
            <Outlet />
        </div>
    )
}

const router = createBrowserRouter([
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

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <DataProvider>
                <RouterProvider router={router} />
            </DataProvider>
        </ThemeProvider>
    </React.StrictMode>
)
