import { Box, FormLabel, Typography } from "@mui/material"
import React from "react"
import Recoil from "recoil"
import { IPlanet } from "../../simulation/types.d"
import PlanetAuth from "../components/PlanetAuth"
import DockingBays from "../components/dockingbays/"

const Surface = ({ planet }: { planet: IPlanet }) => {
  return (
    <>
      <div style={{ backgroundColor: "lightgray", height: 200, }} >
      </div>
      <Box>
        <DockingBays planet={planet} />
      </Box>
    </>
  )
}

const Authed = () => {
  return (<PlanetAuth view={(planet: IPlanet) => (<Surface planet={planet} />)} />)
}

export default Authed