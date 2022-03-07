import React from "react"
import Recoil from "recoil"
import {
  Grid,
  Button,
  CssBaseline,
  ThemeProvider,
  Typography,
  Container,
  createTheme,
  Stack,
} from "@mui/material"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom"
import { GameContextProvider, useGameContext, initializeFn } from "../../GameContext"
import { DGame, planetsSelector, planetSelector } from "../../data"
import Setup from "../Setup"
import QuitGame from "../Quit/Quit"
import { useLocalStorageValue } from "../../localStorage"

const Menu = () => {
  const game = Recoil.useRecoilValue(DGame)
  const context = useGameContext()
  const saveGameId = useLocalStorageValue("game_id")
  const navigate = useNavigate()

  const handleContinueClick = () => {
    navigate(`/setup/${saveGameId}`)
  }

  const handleNewGameClick = () => {
    navigate("/setup")
  }

  const handleHostGameClick = () => {
    navigate("/setup/?multiplayer=true")
  }

  let content
  if (game && game.id) // || context.initialized)
  {
    content = (<QuitGame />)
  }
  else
  {
    content = (
      <Stack>
        <Button onClick={handleContinueClick} disabled={!(saveGameId)}>Continue</Button>
        <Button onClick={handleNewGameClick}>New Game</Button>
        <Button onClick={handleHostGameClick}>Host Game</Button>
      </Stack>
    )
  }

  return content
}

export default Menu