import React from "react"
import Recoil from "recoil"
import { BrowserRouter, Routes, Route, Navigate, Link as RouterLink } from "react-router-dom"
import { Game as GameData } from "../../data/Game"
import { Box, Link, Button, Grid } from "@mui/material"
import { useLocalStorageValue } from "../../data/localStorage"
// import SolarSystem from "./solarsystem"
import { IPlanet } from "../../simulation/types"
import SolarSystem from "./solarsystem/"
import Overview from "./overview/"


const Game = () => {
  // const planets = Recoil.useRecoilValue(planetsSelector)
  const currentGameId = useLocalStorageValue("game") as string

  return (
    <>
      <Routes>
        <Route path="/" element={<SolarSystem />} />
        <Route path="/combat" element="combat" />
        <Route path="/dock" element="dock" />
        <Route path="/fleet" element="fleet" />
        <Route path="/overview" element={<Overview />} />
        <Route path="/shipyard" element="shipyard" />
        <Route path="/surface" element="surface" />
        <Route path="/training" element="training" />
      </Routes>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          typography: 'body1',
          '& > :not(style) + :not(style)': {
            ml: 2,
          },
        }}
      >
        <Link component={RouterLink} to={`/play/${currentGameId}/`}>Solar System</Link>
        <Link component={RouterLink} to={`/play/${currentGameId}/combat`}>Combat</Link>
        <Link component={RouterLink} to={`/play/${currentGameId}/dock`}>Dock</Link>
        <Link component={RouterLink} to={`/play/${currentGameId}/fleet`}>Fleet</Link>
        <Link component={RouterLink} to={`/play/${currentGameId}/overview`}>Overview</Link>
        <Link component={RouterLink} to={`/play/${currentGameId}/shipyard`}>Shipyard</Link>
        <Link component={RouterLink} to={`/play/${currentGameId}/surface`}>Surface</Link>
        <Link component={RouterLink} to={`/play/${currentGameId}/training`}>Training</Link>
      </Box>
    </>
  )
}

const GameRoot = () => {
  const game = Recoil.useRecoilValue(GameData)

  let content

  if (!game || !game.id)
  {
    console.warn("No game state data, redirect to main menu")
    content = (<Navigate to="/" replace />)
  }
  else
  {
    content = (<Game />)
  }

  return content
}

export default GameRoot