import { Button, Grid } from "@mui/material"
import React from "react"
import Recoil from "recoil"
import { SelectedPlanet, IPlanet } from "../../data/Planets"
import DockingBays from "../components/dockingbays"
import PlanetGrid from "../components/grid/PlanetGrid"
import PlanetAuth from "../components/PlanetAuth"
import ShipDetails from "./ShipDetails"
import ShipHeading from "./ShipHeading"

const Fleet = ({ planet }: { planet: IPlanet }) => {

  const handleSelectPlanet = () => {

  }

  return (
    <Grid container>
      <Grid item xs={2}>
        <DockingBays planet={planet} />
      </Grid>
      <Grid item xs={8}>
        <div>
          <Button>Launch</Button>
          <Button>Travel To</Button>
          <Button>Land</Button>
        </div>
        <ShipDetails />
      </Grid>
      <Grid item xs={2}>
        <Button>Abort Travel</Button>
        <Button>Rename</Button>
      </Grid>
      <Grid item xs={8}>
        {/* <FleetGrid /> */}
        <PlanetGrid onSelectItem={handleSelectPlanet} />
      </Grid>
      <Grid item xs={4}>
        <ShipHeading />
      </Grid>
    </Grid>
  )
}

const Authed = () => {
  return (<PlanetAuth view={(planet: IPlanet) => (<Fleet planet={planet} />)} />)
}

export default Authed