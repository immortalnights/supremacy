import React from "react"
import Recoil from "recoil"
import { LinearProgress } from "@mui/material"
import { IOContext } from "../data/IOContext"
import { Player } from "../data/Player"

const ConnectionStatus = () => {
    const { connected } = React.useContext(IOContext)
    const id = Recoil.useRecoilValue(Player)

    return connected ? (
        <LinearProgress variant="determinate" color="inherit" value={0} />
    ) : (
        <LinearProgress color="inherit" />
    )
}

export default ConnectionStatus
