import React from "react"
import Recoil from "recoil"
import {
  Button,
  Link,
  Stack,
} from "@mui/material"
import {
  useNavigate, Link as RouterLink
} from "react-router-dom"
import { useLocalStorageValue } from "../../data/localStorage"
import Setup from "../Setup"
import QuitGame from "../Quit/Quit"
import { AGame } from "../../data/Game"

const Menu = () => {
  const currentGameId = useLocalStorageValue("game")

  return (
    <Stack>
      <Button to="/setup" component={RouterLink} disabled>Continue</Button>
      <Button to="/setup" component={RouterLink}>New Game</Button>
      <Button to="/browse" component={RouterLink}>Join Game</Button>
    </Stack>
  )
}

export default Menu