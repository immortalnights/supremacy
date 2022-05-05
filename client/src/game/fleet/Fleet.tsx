import React from "react"
import Recoil from "recoil"
import { Button, Grid } from "@mui/material"
import { IOContext } from "../../data/IOContext"
import { SelectedPlanet, IPlanet } from "../../data/Planets"
import DockingBays from "../components/dockingbays"
import FleetGrid from "../components/grid/FleetGrid"
import PlanetAuth from "../components/PlanetAuth"
import ShipDetails from "./ShipDetails"
import ShipHeading from "./ShipHeading"
import { IShip } from "../../simulation/types.d"

const Fleet = ({ planet }: { planet: IPlanet }) => {
  // FIXME remember selected ship on navigation?
  const { action } = React.useContext(IOContext)
  const [ ship, setShip ] = React.useState<IShip | undefined>()

  const handleClickDockedShip = (event: React.MouseEvent<HTMLLIElement>, ship: IShip) => {
    setShip(ship)
  }

  const handleSelectPlanet = () => {
  }

  const handleSelectShip = (item: IShip) => {
    console.log(item)
    setShip(item)
  }

  const handleLaunchClick = () => {
    console.assert(ship, "")
    action("ship-relocate", { id: ship!.id, location: planet.id, position: "orbit" })

  }

  const handleTravelToClick = () => {

  }

  const handleLandClick = () => {
    console.assert(ship, "")
    action("ship-relocate", { id: ship!.id, location: planet.id, position: "docking-bay" })
  }

  let canLaunch = false
  let canTravel = false
  let canLand = false

  if (ship)
  {
    const hasCrew = (ship.requiredCrew > 0 || ship.crew === ship.requiredCrew)
    canLaunch = ship.location.position === "docking-bay" && hasCrew && ship.fuels > 0
    canTravel = ship.location.position === "orbit" && hasCrew && ship.fuels > 0
    canLand = ship.location.position === "orbit"
  }

  return (
    <Grid container>
      <Grid item xs={2}>
        <DockingBays planet={planet} onItemClick={handleClickDockedShip} />
      </Grid>
      <Grid item xs={8}>
        <div>
          <Button disabled={!canLaunch} onClick={handleLaunchClick}>Launch</Button>
          <Button disabled={!canTravel} onClick={handleTravelToClick}>Travel To</Button>
          <Button disabled={!canLand} onClick={handleLandClick}>Land</Button>
        </div>
        <ShipDetails ship={ship} />
      </Grid>
      <Grid item xs={2}>
        <Button>Abort Travel</Button>
        <Button>Rename</Button>
      </Grid>
      <Grid item xs={8}>
        {/* <FleetGrid /> */}
        <FleetGrid selectedItem={ship} onSelectItem={handleSelectShip} />
      </Grid>
      <Grid item xs={4}>
        <ShipHeading ship={ship} />
      </Grid>
    </Grid>
  )
}

const Authed = () => {
  return (<PlanetAuth view={(planet: IPlanet) => (<Fleet planet={planet} />)} />)
}

export default Authed