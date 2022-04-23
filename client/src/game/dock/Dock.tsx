import React from "react"
import Recoil from "recoil"
import { Grid, Stack, IconButton, Button, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogProps, DialogActions } from "@mui/material"
import { ArrowDropUp, ArrowDropDown, LocalGasStation, Man, Woman, Add, Download, Clear } from "@mui/icons-material"
import { red, green } from "@mui/material/colors"
import { IOContext } from "../../data/IOContext"
import { SelectedPlanet, IPlanet, CapitalPlanet } from "../../data/Planets"
import PlanetAuth from "../components/PlanetAuth"
import DockingBays from "../components/dockingbays"
import ShipProperties from "./ShipProperties"
import { IShip } from "../../simulation/types.d"
import "./styles.css"

interface IShipDetailsProps {
  ship: IShip | undefined
  onModifyPassengers: (ship: IShip, amount: number) => void
  onModifyFuels: (ship: IShip, amount: number) => void
  onClickAddCrew: (ship: IShip) => void
  onClickEmptyCargo: (ship: IShip) => void
  onClickDecommission: (ship: IShip) => void
}

const ShipDetails = ({
  ship,
  onModifyPassengers,
  onModifyFuels,
  onClickAddCrew,
  onClickEmptyCargo,
  onClickDecommission
}: IShipDetailsProps) => {

  const handleClickAddPassengers: React.MouseEventHandler = (event) => {
    onModifyPassengers(ship as IShip, 1)
  }

  const handleClickRemovePassengers: React.MouseEventHandler = (event) => {
    onModifyPassengers(ship as IShip, -1)
  }

  const handleClickAddFuels: React.MouseEventHandler = (event) => {
    onModifyFuels(ship as IShip, 1)
  }

  const handleClickRemoveFuels: React.MouseEventHandler = (event) => {
    onModifyFuels(ship as IShip, -1)
  }

  let canModifyPassengers = ship?.capacity?.civilians || false
  let canModifyFuels = ship?.capacity?.fuels
  let canAddCrew = (ship?.requiredCrew || 0) > 0 && ship?.crew === 0
  // FIXME
  let canEmptyCargo = false
  let canDecommission = !!ship

  return (
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
      <div style={{ height: 80, width: 100, backgroundColor: "lightgray" }} />
      <div>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{ship?.passengers || 0}</Typography>
        <Stack direction="row">
          <Stack direction="column">
            <IconButton size="small" disabled={!canModifyPassengers} onClick={handleClickAddPassengers}><ArrowDropUp /></IconButton>
            <IconButton size="small" disabled={!canModifyPassengers} onClick={handleClickRemovePassengers}><ArrowDropDown /></IconButton>
          </Stack>
          <div><Man /><Woman /></div>
        </Stack>
      </div>
      <div>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{ship?.fuels}</Typography>
        <Stack direction="row">
          <Stack direction="column">
            <IconButton size="small" disabled={!canModifyFuels} onClick={handleClickAddFuels}><ArrowDropUp /></IconButton>
            <IconButton size="small" disabled={!canModifyFuels} onClick={handleClickRemoveFuels}><ArrowDropDown /></IconButton>
          </Stack>
          <div><LocalGasStation /></div>
        </Stack>
      </div>
      <Stack direction="column">
        <Button fullWidth={true} size="small" startIcon={<Add />} disabled={!canAddCrew} onClick={() => onClickAddCrew(ship as IShip)}>Add Crew</Button>
        <Button fullWidth={true} size="small" startIcon={<Download />} disabled={!canEmptyCargo} onClick={() => onClickEmptyCargo(ship as IShip)}>Empty Cargo</Button>
        <Button fullWidth={true} size="small" startIcon={<Clear />} disabled={!canDecommission} onClick={() => onClickDecommission(ship as IShip)}>Decommission</Button>
      </Stack>
    </div>
  )
}

const Bars = ({ left, right }: { left: number, right: number }) => {
  const maxPlanetCapacity = (260 / 4) * 250
  const leftHeight = left > 0 ? 260 * (left / maxPlanetCapacity) : 0
  const maxShipCapacity = (260 / 4) * 25
  const rightHeight = right > 0 ? 260 * (right / maxShipCapacity) : 0

  return (
    <div style={{ height: 280, border: "1px solid darkgreen", display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
      <div className="striped-green" style={{ height: leftHeight, width: "50%" }} />
      <div className="striped-red" style={{ height: rightHeight, width: "50%" }} />
    </div>
  )
}

const Inventory = ({ planet, ship }: { planet: IPlanet, ship: IShip | undefined }) => {
  return (
    <Grid container>
      <Grid item xs={3} sx={{ padding: "0 1rem" }}>
        <Bars left={planet.resources.food} right={0} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton><ArrowDropUp sx={{ color: green[500] }} /></IconButton>
          <IconButton><ArrowDropUp sx={{ color: red[500] }} /></IconButton>
        </div>
        <Typography component="div" variant="overline" sx={{ textAlign: "center" }}>Food</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{planet.resources.food}</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{ship?.cargo.food || 0}</Typography>
      </Grid>
      <Grid item xs={3} sx={{ padding: "0 1rem" }}>
        <Bars left={planet.resources.minerals} right={0} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton><ArrowDropUp sx={{ color: green[500] }} /></IconButton>
          <IconButton><ArrowDropUp sx={{ color: red[500] }} /></IconButton>
        </div>
        <Typography component="div" variant="overline" sx={{ textAlign: "center" }}>Minerals</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{planet.resources.minerals}</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{ship?.cargo.minerals || 0}</Typography>
      </Grid>
      <Grid item xs={3} sx={{ padding: "0 1rem" }}>
        <Bars left={planet.resources.fuels} right={0} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton><ArrowDropUp sx={{ color: green[500] }} /></IconButton>
          <IconButton><ArrowDropUp sx={{ color: red[500] }} /></IconButton>
        </div>
        <Typography component="div" variant="overline" sx={{ textAlign: "center" }}>Fuels</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{planet.resources.fuels}</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{ship?.cargo.fuels || 0}</Typography>
      </Grid>
      <Grid item xs={3} sx={{ padding: "0 1rem" }}>
        <Bars left={planet.resources.energy} right={0} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton><ArrowDropUp sx={{ color: green[500] }} /></IconButton>
          <IconButton><ArrowDropUp sx={{ color: red[500] }} /></IconButton>
        </div>
        <Typography component="div" variant="overline" sx={{ textAlign: "center" }}>Energy</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{planet.resources.energy}</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{ship?.cargo.energy || 0}</Typography>
      </Grid>
    </Grid>
  )
}

interface ConfirmDecommissionDialogProps {
  ship: IShip
  onConfirm: (ship: IShip) => void
  onCancel: () => void
}

const ConfirmDecommission = (props: ConfirmDecommissionDialogProps & DialogProps) => {
  const capital = Recoil.useRecoilValue(CapitalPlanet)
  const { ship, onConfirm, onCancel, ...dialogProps } = props

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>Decommission</DialogTitle>
      <DialogContent>
        <DialogContentText textAlign="center">Decommission ship '{ship.name}'?</DialogContentText>
        {capital && <DialogContentText>{capital.name} will receive {ship.value} credits.</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={onCancel}>Cancel</Button>
        <Button size="small" color="error" onClick={() => onConfirm(ship)}>Decommission</Button>
      </DialogActions>
    </Dialog>
  )
}

export const Dock = ({ planet }: { planet: IPlanet }) => {
  const [ ship, setShip ] = React.useState<IShip | undefined>()
  const [ confirmDecommission, setConfirmDecommission ] = React.useState(false)
  const { action } = React.useContext(IOContext)

  const handleClickDockedShip = (event: React.MouseEvent<HTMLLIElement>, ship: IShip) => {
    setShip(ship)
  }

  const handleModifyPassengers = (ship: IShip, amount: number) => {
    action("ship-modify-passengers", { id: ship.id, amount })
  }

  const handleModifyFuels = (ship: IShip, amount: number) => {
    action("ship-modify-fuels", { id: ship.id, amount })
  }

  const handleClickAddCrew = (ship: IShip) => {
    action("ship-add-crew", { id: ship.id })
  }

  const handleClickEmptyCargo = (ship: IShip) => {
    action("ship-empty-cargo", { id: ship.id })
  }

  const handleClickDecommission = (ship: IShip) => {
    setConfirmDecommission(true)
  }

  const handleConfirmDecommission = (ship: IShip) => {
    action("ship-decommission", { id: ship.id })
    setConfirmDecommission(false)
  }

  const handleClose = () => {
    setConfirmDecommission(false)
  }

  return (
    <Grid container>
      <Grid item xs={8}>
        {ship && <ConfirmDecommission ship={ship as IShip} open={confirmDecommission} onConfirm={handleConfirmDecommission} onCancel={handleClose} onClose={handleClose} />}
        <Stack direction="row" justifyContent="space-around">
          <DockingBays planet={planet} onItemClick={handleClickDockedShip} />
          <ShipProperties planet={planet} ship={ship} />
        </Stack>
        <ShipDetails
          ship={ship}
          onModifyPassengers={handleModifyPassengers}
          onModifyFuels={handleModifyFuels}
          onClickAddCrew={handleClickAddCrew}
          onClickEmptyCargo={handleClickEmptyCargo}
          onClickDecommission={handleClickDecommission}
        />
      </Grid>
      <Grid item xs={4}>
        <Inventory planet={planet} ship={ship} />
      </Grid>
    </Grid>
  )
}


const Authed = () => {
  return (<PlanetAuth view={(planet: IPlanet) => (<Dock planet={planet} />)} />)
}

export default Authed
