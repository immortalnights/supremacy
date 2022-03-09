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
  const game = Recoil.useRecoilValue(AGame)
  const currentGameId = useLocalStorageValue("game")
  const navigate = useNavigate()

  const handleContinueClick = () => {
    navigate(`/setup/${currentGameId}`)
  }

  const handleNewGameClick = () => {
    navigate("/setup")
  }

  const handleHostGameClick = () => {
    navigate("/setup/?multiplayer=true")
  }

  let content
  if (game && game.id)
  {
    content = (<QuitGame />)
  }
  else
  {
    content = (
      <Stack>
        <Button onClick={handleContinueClick} disabled={!(currentGameId)}>Continue</Button>
        <Button onClick={handleNewGameClick}>New Game</Button>
        <Button onClick={handleHostGameClick}>Host Game</Button>
      </Stack>
    )
  }

  return content
}

export default Menu