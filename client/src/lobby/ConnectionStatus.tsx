import React from "react"
import Recoil from "recoil"
import { Typography } from "@mui/material"
import { IOContext } from "../data/IOContext"
import { Player } from "../data/Player"


const ConnectionStatus = () => {
  const { status } = React.useContext(IOContext)
  const id = Recoil.useRecoilValue(Player)

  return (
    <Typography color={id ? "green" : "red"} sx={{ float: "right" }}>({status})</Typography>
  )
}

export default ConnectionStatus