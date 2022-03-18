import React from "react"
import Recoil from "recoil"
import {
  Button,
  Stack,
} from "@mui/material"
import {
  useNavigate,
} from "react-router-dom"
import { useLocalStorageValue } from "../../data/localStorage"
import Setup from "../Setup"
import QuitGame from "../Quit/Quit"
import { AGame } from "../../data/Game"

const Menu = () => {
  const currentGameId = useLocalStorageValue("game")
  const navigate = useNavigate()

  const handleContinueClick = () => {
    navigate(`/setup/${currentGameId}`)
  }

  const handleJoinGameClick = () => {
    navigate("/browse/")
  }

  const handleNewGameClick = () => {
    navigate("/setup")
  }

  return (
    <Stack>
      <Button onClick={handleContinueClick} disabled={true}>Continue</Button>
      <Button onClick={handleNewGameClick}>New Game</Button>
      <Button onClick={handleJoinGameClick}>Join Game</Button>
    </Stack>
  )
}

export default Menu