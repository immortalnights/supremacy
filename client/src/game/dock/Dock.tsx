import React from "react"
import Recoil from "recoil"
import { Grid, Stack, IconButton, Button, Typography } from "@mui/material"
import { ArrowDropUp, ArrowDropDown, LocalGasStation, Man, Woman, Add, Download, Clear } from "@mui/icons-material"
import { red, green } from "@mui/material/colors"
import { IOContext } from "../../data/IOContext"
import { SelectedPlanet, IPlanet } from "../../data/Planets"
import PlanetAuth from "../components/PlanetAuth"
import DockingBays from "../components/dockingbays"
import ShipProperties from "./ShipProperties"
import "./styles.css"

const ShipDetails = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ height: 80, width: 100, backgroundColor: "lightgray" }} />
      <div>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>0</Typography>
        <Stack direction="row">
          <Stack direction="column">
            <IconButton size="small"><ArrowDropUp /></IconButton>
            <IconButton size="small"><ArrowDropDown /></IconButton>
          </Stack>
          <div><Man /><Woman /></div>
        </Stack>
      </div>
      <div>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>0</Typography>
        <Stack direction="row">
          <Stack direction="column">
            <IconButton size="small"><ArrowDropUp /></IconButton>
            <IconButton size="small"><ArrowDropDown /></IconButton>
          </Stack>
          <div><LocalGasStation /></div>
        </Stack>
      </div>
      <Stack direction="column">
        <Button fullWidth={true} size="small" startIcon={<Add />}>Add Crew</Button>
        <Button fullWidth={true} size="small" startIcon={<Download />}>Empty Cargo</Button>
        <Button fullWidth={true} size="small" startIcon={<Clear />}>Decommission</Button>
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

export const Dock = ({ planet }: { planet: IPlanet }) => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <Stack direction="row">
          <DockingBays planet={planet} />
          <ShipProperties planet={planet} />
        </Stack>
        <ShipDetails />
      </Grid>
      <Grid item xs={1} sx={{ padding: "0 1rem" }}>
        <Bars left={planet.resources.food} right={0} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton><ArrowDropUp sx={{ color: green[500] }} /></IconButton>
          <IconButton><ArrowDropUp sx={{ color: red[500] }} /></IconButton>
        </div>
        <Typography component="div" variant="overline" sx={{ textAlign: "center" }}>Food</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{planet.resources.food}</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>0</Typography>
      </Grid>
      <Grid item xs={1} sx={{ padding: "0 1rem" }}>
        <Bars left={planet.resources.minerals} right={0} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton><ArrowDropUp sx={{ color: green[500] }} /></IconButton>
          <IconButton><ArrowDropUp sx={{ color: red[500] }} /></IconButton>
        </div>
        <Typography component="div" variant="overline" sx={{ textAlign: "center" }}>Minerals</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{planet.resources.minerals}</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>0</Typography>
      </Grid>
      <Grid item xs={1} sx={{ padding: "0 1rem" }}>
        <Bars left={planet.resources.fuels} right={0} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton><ArrowDropUp sx={{ color: green[500] }} /></IconButton>
          <IconButton><ArrowDropUp sx={{ color: red[500] }} /></IconButton>
        </div>
        <Typography component="div" variant="overline" sx={{ textAlign: "center" }}>Fuels</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{planet.resources.fuels}</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>0</Typography>
      </Grid>
      <Grid item xs={1} sx={{ padding: "0 1rem" }}>
        <Bars left={planet.resources.energy} right={0} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton><ArrowDropUp sx={{ color: green[500] }} /></IconButton>
          <IconButton><ArrowDropUp sx={{ color: red[500] }} /></IconButton>
        </div>
        <Typography component="div" variant="overline" sx={{ textAlign: "center" }}>Energy</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>{planet.resources.energy}</Typography>
        <Typography component="div" variant="caption" sx={{ textAlign: "right" }}>0</Typography>
      </Grid>
    </Grid>
  )
}


const Authed = () => {
  return (<PlanetAuth view={(planet: IPlanet) => (<Dock planet={planet} />)} />)
}

export default Authed
