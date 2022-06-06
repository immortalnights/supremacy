import React from "react"
import Recoil from "recoil"
import { Button, Grid, Typography } from "@mui/material"
import { IOContext } from "../../data/IOContext"
import { SelectedPlanetID } from "../../data/General"
import { SelectedPlanet, IPlanet, IPlanetBasic } from "../../data/Planets"
import { Ship } from "../../data/Ships"
import DockingBays from "../components/DockingBays"
import FleetGrid from "../components/grid/FleetGrid"
import PlanetAuth from "../components/PlanetAuth"
import ShipDetails from "./ShipDetails"
import ShipHeading from "./ShipHeading"
import { IShip, ShipID } from "../../simulation/types.d"
import RenameDialog from "../components/RenameDialog"
import PlanetGrid from "../components/grid/PlanetGrid"

type FleetMode = "normal" | "ship-destination"

const Fleet = ({ planet }: { planet: IPlanet }) => {
  const [ selectedShip, setSelectedShip ] = React.useState<ShipID | undefined>()
  const [ selected, setSelected ] = Recoil.useRecoilState(SelectedPlanetID)
  const [ renameShip, setRenameShip ] = React.useState(false)
  const [ mode, setMode ] = React.useState<FleetMode>("normal")
  const ship = Recoil.useRecoilValue(Ship(selectedShip))
  const { action } = React.useContext(IOContext)

  const handleClickDockedShip = (event: React.MouseEvent<HTMLLIElement>, dockedShip: IShip) => {
    setSelectedShip(dockedShip.id)
  }

  const handleSelectShip = (selectedShip: IShip) => {
    setSelectedShip(selectedShip.id)
  }

  const handleAbortTravelClick = () => {
    action("ship-abort-travel", { id: ship!.id })
  }

  const handleRenameClick = () => {
    setRenameShip(true)
  }

  const handleCancelRenameShip = () => {
    setRenameShip(false)
  }

  const handleRenameShip = (name: string) => {
    action("ship-rename", { id: ship!.id, name })
    setRenameShip(false)
  }

  const handleLaunchClick = () => {
    console.assert(ship, "")
    action("ship-relocate", { id: ship!.id, position: "orbit" })
  }

  const handleTravelToClick = () => {
    setMode("ship-destination")
  }

  const handleLandClick = () => {
    console.assert(ship, "")
    action("ship-relocate", { id: ship!.id, position: "docking-bay" })
  }

  const handleSelectPlanet = (planet: IPlanetBasic) => {
    action("ship-travel", { id: ship!.id, location: planet.id })
    setMode("normal")
  }

  const handleCancelTravel = () => {
    setMode("normal")
  }

  let canLaunch = false
  let canTravel = false
  let canLand = false
  let canAbortTravel = false
  let canRename = false

  if (ship)
  {
    if (ship.type !== "Atmosphere Processor")
    {
      const hasCrew = (ship.requiredCrew === 0 || ship.crew === ship.requiredCrew)
      const hasFuel = (ship.capacity.fuels === 0 || ship.fuels > 0)
      canLaunch = ship.location.position === "docking-bay" && hasCrew && hasFuel
      canTravel = ship.location.position === "orbit" && hasCrew && hasFuel
      canLand = ship.location.position === "orbit"
      canAbortTravel = ship.location.position === "deep-space"
    }
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
        {ship && renameShip && <RenameDialog open name={ship.name} onConfirm={handleRenameShip} onCancel={handleCancelRenameShip} />}
        <Button disabled={!canAbortTravel} onClick={handleAbortTravelClick}>Abort Travel</Button>
        <Button disabled={!canRename} onClick={handleRenameClick}>Rename</Button>
      </Grid>
      <Grid item xs={8}>
        {
          (ship && mode === "ship-destination")
          ? <><PlanetGrid onSelectItem={handleSelectPlanet} /><Typography textAlign="center">Select destination planet or <Button variant="text" onClick={handleCancelTravel}>Cancel</Button></Typography></>
          : <FleetGrid selectedItem={ship} onSelectItem={handleSelectShip} />
        }
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