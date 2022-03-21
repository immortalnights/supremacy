import React from "react"
import {
  Button,
  Stack,
} from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import { useLocalStorageValue } from "../../data/localStorage"

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