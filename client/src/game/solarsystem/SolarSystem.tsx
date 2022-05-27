import React from "react"
import Recoil from "recoil"
import { Button, Grid, List, ListItemButton, ListItemAvatar, ListItemText, Box, Stack, Typography } from "@mui/material"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { IOContext } from "../../data/IOContext"
import { SelectedPlanet, Planets as PlanetData, IPlanet, IPlanetBasic } from "../../data/Planets"
import { PlanetType } from "../../simulation/types"
import { SelectedPlanetID } from "../../data/General"
import { Game as GameData } from "../../data/Game"
import { EspionageReport as EspionageReportData } from "../../data/Espionage"
import { PlayerShips } from "../../data/Ships"
import { Player } from "../../data/Player"
import CurrentStarDate, { StarDate } from "../components/StarDate"
import EspionageDialog from "./EspionageDialog"
import "./styles.css"

const PlanetList = () => {
  const game = Recoil.useRecoilValue(GameData)
  const planets = Recoil.useRecoilValue(PlanetData)
  const [ selected, setSelected ] = Recoil.useRecoilState(SelectedPlanetID)
  const navigate = useNavigate()

  const handlePlanetClick = (id: number, nav: boolean = false) => {
    setSelected(id)

    if (nav)
    {
      navigate(`/game/${game?.id}/overview`)
    }
  }
  //}`--i:${index + 1}
//<ListItemButton key={planet.id} component={RouterLink} to={`/game/${game?.id}/overview/${planet.id}`}>
  return (
    <List dense sx={{
      padding: "1em",
    }}>
      {planets.map((planet) => (
        <ListItemButton key={planet.id} selected={planet.id === selected} onClick={() => handlePlanetClick(planet.id)} onDoubleClick={() => handlePlanetClick(planet.id, true)}>
          <ListItemAvatar />
          <ListItemText primary={`${planet.name}`} />
          {planet.terraforming && <Typography component="span" variant="body2" color="text.secondary" className="wavey">
            {"Terraforming".split("").map((l, index) => (
              <span key={index} style={{"--i": index + 1} as React.CSSProperties}>{l}</span>
            ))}
          </Typography>}
        </ListItemButton>
      ))}
    </List>
  )
}

const SelectedPlanetInfo = () => {
  const planet = Recoil.useRecoilValue(SelectedPlanet)
  const player = Recoil.useRecoilValue(Player)
  const atmos = Recoil.useRecoilValue(PlayerShips).find((s) => s.type === "Atmosphere Processor")
  const [espionage, setEspionage] = React.useState(false)
  const { action } = React.useContext(IOContext)

  const canTerraform = atmos && atmos.heading == null && planet && planet.type === PlanetType.Lifeless
  const canSpy = planet && planet.owner && planet.owner !== player.id

  // FIXME button title does not work when disabled; show icon instead?
  let terraformReason = ""
  if (!atmos)
  {
    terraformReason = "Atmosphere Processor Required"
  }
  else if (atmos.heading)
  {
    terraformReason = "Atmosphere Processor is busy"
  }

  const handleClickTerraform = () => {
    action("planet-terraform", { id: planet!.id })
  }

  const handleClickEspionage = () => {
    setEspionage(true)
  }

  const handleConfirmEspionageDialog = (planet: IPlanetBasic, mission: string) => {
    action("planet-espionage", { id: planet.id, mission })
    setEspionage(false)
  }

  const handleCancelEspionageDialog = () => {
    setEspionage(false)
  }

  return (
    <div>
      {espionage && planet && <EspionageDialog open planet={planet} onConfirm={handleConfirmEspionageDialog} onCancel={handleCancelEspionageDialog} />}
      <Stack direction="column" alignItems="center">
        <div><CurrentStarDate /></div>
        <div style={{ height: 96, width: 96, backgroundColor: "lightgray", padding: 4 }}>{planet?.type}</div>
        <div>{planet?.name}</div>
        <div>
          <Button disabled={!canTerraform} onClick={handleClickTerraform}>Terraform</Button>
          <Button disabled={!canSpy} onClick={handleClickEspionage}>Espionage</Button>
        </div>
      </Stack>
    </div>
  )
}

const EspionageReport = () => {
  const [report, setReport] = Recoil.useRecoilState(EspionageReportData)

  const handleClickDismissReport = () => {
    setReport(undefined)
  }

  return report ? (
    <Stack direction="column" alignItems="center">
      <Typography variant="subtitle2">Espionage Report</Typography>
      <Grid container>
        <Grid item xs={5} textAlign="right">Planet</Grid>
        <Grid item xs={2} />
        <Grid item xs={5}>{report.planet.name}</Grid>
        <Grid item xs={5} textAlign="right">Date</Grid>
        <Grid item xs={2} />
        <Grid item xs={5}><StarDate date={report.date} /></Grid>
        {report.food !== undefined && (<><Grid item xs={5} textAlign="right">Food</Grid><Grid item xs={2} /><Grid item xs={5}>{report.food}</Grid></>)}
        {report.minerals !== undefined && (<><Grid item xs={5} textAlign="right">Minerals</Grid><Grid item xs={2} /><Grid item xs={5}>{report.minerals}</Grid></>)}
        {report.fuels !== undefined && (<><Grid item xs={5} textAlign="right">Fuels</Grid><Grid item xs={2} /><Grid item xs={5}>{report.fuels}</Grid></>)}
        {report.energy !== undefined && (<><Grid item xs={5} textAlign="right">Energy</Grid><Grid item xs={2} /><Grid item xs={5}>{report.energy}</Grid></>)}
        {report.strength !== undefined && (<><Grid item xs={5} textAlign="right">Strength</Grid><Grid item xs={2} /><Grid item xs={5}>{report.strength}</Grid></>)}
        {report.civilians !== undefined && (<><Grid item xs={5} textAlign="right">Civilians</Grid><Grid item xs={2} /><Grid item xs={5}>{report.civilians}</Grid></>)}
      </Grid>
      <div style={{ marginTop: "1rem" }}><Button variant="outlined" color="info" size="small" onClick={handleClickDismissReport}>Dismiss Report</Button></div>
    </Stack>
  ) : null
}

const SolarSystem = () => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <PlanetList />
      </Grid>
      <Grid item xs={4}>
        <SelectedPlanetInfo />
        <EspionageReport />
      </Grid>
    </Grid>
  )
}

export default SolarSystem