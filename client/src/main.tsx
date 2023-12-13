import React from "react"
import ReactDOM from "react-dom/client"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import "./index.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { RouterProvider } from "react-router-dom"
import DataProvider from "./data/DataProvider"
import { router } from "./router"

const theme = createTheme()

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
