import React from "react"
import Recoil from "recoil"
import { Box, Link, Button, Grid } from "@mui/material"
import { Routes, Route, NavLink, useNavigate, useParams } from "react-router-dom"
import { IOContext } from "../data/IOContext"
import { IPlayer } from "../data/Player"
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

const Game = ({ data }: { data: IGame }) => {
  return (
    <>
      <Box sx={{
        flexGrow: 1,
        width: "100%",
        padding: "1em",
      }}>
        <Routes>
          <Route path="/" element={<SolarSystem />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/surface" element={<Surface />} />
          <Route path="/dock" element={<Dock />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/shipyard" element={<Shipyard />} />
          <Route path="/training" element={<Training />} />
          <Route path="/combat" element={<Combat />} />
          <Route path="*" element="Game 404" />
        </Routes>
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
        <Link component={NavLink} to={`/game/${data.id}/`}>Solar System</Link>
        <Link component={NavLink} to={`/game/${data.id}/overview`}>Overview</Link>
        <Link component={NavLink} to={`/game/${data.id}/surface`}>Surface</Link>
        <Link component={NavLink} to={`/game/${data.id}/dock`}>Dock</Link>
        <Link component={NavLink} to={`/game/${data.id}/fleet`}>Fleet</Link>
        <Link component={NavLink} to={`/game/${data.id}/shipyard`}>Shipyard</Link>
        <Link component={NavLink} to={`/game/${data.id}/training`}>Training</Link>
        <Link component={NavLink} to={`/game/${data.id}/combat`}>Combat</Link>
        <span style={{ margin: "0 0 0 1rem"}}>|</span><Link component={NavLink} to={`/`}>Quit</Link>
      </Box>
    </>
  )
}


const GameLoader = () => {
  const game = Recoil.useRecoilValue(GameData)
  const { joinGame, leaveGame } = React.useContext(IOContext)
  const navigate = useNavigate()
  const params = useParams()

  React.useEffect(() => {
    const join = async (id: string) => {
      try
      {
        await joinGame(id)
      }
      catch (error)
      {
        console.warn(`Failed to join game ${params.id}`)
        navigate("/", { replace: true })
      }
    }

    if (!game)
    {
      if (params.id)
      {
        join(params.id)
      }
      else
      {
        navigate("/", { replace: true })
      }
    }
  }, [ game, params ])

  React.useEffect(() => {
    return () => {
      console.log("Clean up GameLoader")
      leaveGame()
    }
  }, [])

  return (game ? <Game data={game} /> : <div>Joining Game...</div>)
}

export default GameLoader