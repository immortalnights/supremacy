import React from "react"
import Recoil from "recoil"
import { Button, Grid } from "@mui/material"
import { IOContext } from "../../data/IOContext"
import { SelectedPlanet, IPlanet } from "../../data/Planets"
import { Ship } from "../../data/Ships"
import DockingBays from "../components/DockingBays"
import FleetGrid from "../components/grid/FleetGrid"
import PlanetAuth from "../components/PlanetAuth"
import ShipDetails from "./ShipDetails"
import ShipHeading from "./ShipHeading"
import { IShip, ShipID } from "../../simulation/types.d"
import RenameDialog from "../components/RenameDialog"

const Fleet = ({ planet }: { planet: IPlanet }) => {
  const [ selectedShip, setSelectedShip ] = React.useState<ShipID | undefined>()
  const [ renameShip, setRenameShip ] = React.useState(false)
  const ship = Recoil.useRecoilValue(Ship(selectedShip))
  const { action } = React.useContext(IOContext)

  const handleClickDockedShip = (event: React.MouseEvent<HTMLLIElement>, ship: IShip) => {
    setSelectedShip(ship?.id)
  }

  const handleSelectPlanet = () => {
  }

  const handleSelectShip = (ship: IShip) => {
    setSelectedShip(ship.id)
  }

  const handleAbortTravelClick = () => {
    action("ship-abort-travel", { id: ship!.id })
  }

  const handleRenameClick = () => {
    setRenameShip(true)
  }

  const handleRenameShip = (name: string) => {
    action("ship-rename", { id: ship!.id, name })
    setRenameShip(false)
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
  let canAbortTravel = false
  let canRename = false

  if (ship)
  {
    const hasCrew = (ship.requiredCrew > 0 || ship.crew === ship.requiredCrew)
    canLaunch = ship.location.position === "docking-bay" && hasCrew && ship.fuels > 0
    canTravel = ship.location.position === "orbit" && hasCrew && ship.fuels > 0
    canLand = ship.location.position === "orbit"
    canAbortTravel = false
    canRename = true
  }

  return (
    <Grid container>
      <Grid item xs={2}>
        <DockingBays planet={planet} selected={ship?.id} onItemClick={handleClickDockedShip} />
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
        {ship && renameShip && <RenameDialog open name={ship.name} onConfirm={handleRenameShip} onCancel={() => setRenameShip(false)} />}
        <Button disabled={!canAbortTravel} onClick={handleAbortTravelClick}>Abort Travel</Button>
        <Button disabled={!canRename} onClick={handleRenameClick}>Rename</Button>
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