import React from "react"
import Recoil from "recoil"
import { Box, Link } from "@mui/material"
import { Routes, Route, NavLink, Outlet, Navigate } from "react-router-dom"
import { IOContext } from "../data/IOContext"
import SolarSystem from "./solarsystem"
import Overview from "./overview"
import Surface from "./surface"
import Dock from "./dock"
import Fleet from "./fleet"
import Shipyard from "./shipyard"
import Training from "./training"
import Combat from "./combat"
import { Game as GameData, IGame } from "../data/Game"
import "./game.css"

const Layout = ({ data }: { data: IGame }) => {
    return (
        <>
            <Box
                sx={{
                    flexGrow: 1,
                    width: "100%",
                    padding: "1em",
                }}
            >
                <Outlet />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginBottom: 2,
                    typography: "body1",
                    "& > :not(style) + :not(style)": {
                        ml: 2,
                    },
                }}
            >
                <Link component={NavLink} to={`/game/${data.id}/`}>
                    Solar System
                </Link>
                <Link component={NavLink} to={`/game/${data.id}/overview`}>
                    Overview
                </Link>
                <Link component={NavLink} to={`/game/${data.id}/surface`}>
                    Surface
                </Link>
                <Link component={NavLink} to={`/game/${data.id}/dock`}>
                    Dock
                </Link>
                <Link component={NavLink} to={`/game/${data.id}/fleet`}>
                    Fleet
                </Link>
                <Link component={NavLink} to={`/game/${data.id}/shipyard`}>
                    Shipyard
                </Link>
                <Link component={NavLink} to={`/game/${data.id}/training`}>
                    Training
                </Link>
                <Link component={NavLink} to={`/game/${data.id}/combat`}>
                    Combat
                </Link>
                <span style={{ margin: "0 0 0 1rem" }}>|</span>
                <Link component={NavLink} to={`/`}>
                    Quit
                </Link>
            </Box>
        </>
    )
}

const GameRoutes = ({ ...rest }: { data: IGame }) => {
    return (
        <Routes>
            <Route element={<Layout {...rest} />}>
                <Route path="/" element={<SolarSystem />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/surface" element={<Surface />} />
                <Route path="/dock" element={<Dock />} />
                <Route path="/fleet" element={<Fleet />} />
                <Route path="/shipyard" element={<Shipyard />} />
                <Route path="/training" element={<Training />} />
                <Route path="/combat" element={<Combat />} />
                <Route path="*" element="Game 404" />
            </Route>
        </Routes>
    )
}

const GameLoader = () => {
    const game = Recoil.useRecoilValue(GameData)
    const { joinGame } = React.useContext(IOContext)

    React.useEffect(() => {
        // Join the game (may already have joined) to begin receiving game updates
        void joinGame(game!.id)
    }, [game, joinGame])

    let content
    if (game) {
        content = <GameRoutes data={game} />
    } else {
        content = <Navigate to="/" replace />
    }

    return content
}

export default GameLoader
