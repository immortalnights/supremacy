import React from "react"
import Recoil from "recoil"
import { Button, Grid } from "@mui/material"
import { SelectedPlanet, IPlanet } from "../../data/Planets"
import DockingBays from "../components/dockingbays"
import FleetGrid from "../components/grid/FleetGrid"
import PlanetAuth from "../components/PlanetAuth"
import ShipDetails from "./ShipDetails"
import ShipHeading from "./ShipHeading"
import { IShip } from "../../simulation/types.d"

const Fleet = ({ planet }: { planet: IPlanet }) => {
  // FIXME remember selected ship on navigation?
  const [ selectedShip, setSelectedShip ] = React.useState<IShip | undefined>()

  const handleSelectPlanet = () => {
  }

  const handleSelectShip = (item: IShip) => {
    console.log(item)
    setSelectedShip(item)
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
        <ShipDetails ship={selectedShip} />
      </Grid>
      <Grid item xs={2}>
        <Button>Abort Travel</Button>
        <Button>Rename</Button>
      </Grid>
      <Grid item xs={8}>
        {/* <FleetGrid /> */}
        <FleetGrid selectedItem={selectedShip} onSelectItem={handleSelectShip} />
      </Grid>
      <Grid item xs={4}>
        <ShipHeading ship={selectedShip} />
      </Grid>
    </Grid>
  )
}

const Authed = () => {
  return (<PlanetAuth view={(planet: IPlanet) => (<Fleet planet={planet} />)} />)
}

export default Authed