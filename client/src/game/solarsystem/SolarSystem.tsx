import React from "react"
import Recoil from "recoil"
import { Button, Grid, List, ListItemButton, ListItemAvatar, ListItemText, Box, Stack } from "@mui/material"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { IOContext } from "../../data/IOContext"
import { SelectedPlanet as SelectedPlanetId } from "../../data/General"
import { SelectedPlanet, Planets as PlanetData, IPlanet } from "../../data/Planets"
import { Game as GameData } from "../../data/Game"
import { PlayerShips } from "../../data/Ships"
import StarDate from "../components/StarDate"
import { Player } from "../../data/Player"
import { PlanetType } from "../../simulation/types"


const PlanetList = () => {
  const game = Recoil.useRecoilValue(GameData)
  const planets = Recoil.useRecoilValue(PlanetData)
  const [ selected, setSelected ] = Recoil.useRecoilState(SelectedPlanetId)
  const navigate = useNavigate()

  const handlePlanetClick = (id: number, nav: boolean = false) => {
    setSelected(id)

    if (nav)
    {
      navigate(`/game/${game?.id}/overview`)
    }
  }
//<ListItemButton key={planet.id} component={RouterLink} to={`/game/${game?.id}/overview/${planet.id}`}>
  return (
    <List dense sx={{
      padding: "1em",
    }}>
      {planets.map((planet) => (
        <ListItemButton key={planet.id} selected={planet.id === selected} onClick={() => handlePlanetClick(planet.id)} onDoubleClick={() => handlePlanetClick(planet.id, true)}>
          <ListItemAvatar />
          <ListItemText primary={`${planet.name}`} />
        </ListItemButton>
      ))}
    </List>
  )
}

const SelectedPlanetInfo = () => {
  const planet = Recoil.useRecoilValue(SelectedPlanet)
  const player = Recoil.useRecoilValue(Player)
  const atmos = Recoil.useRecoilValue(PlayerShips).find((s) => s.type === "Atmosphere Processor")
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
    // TODO espionage dialog
  }

  return (
    <div>
      <Stack direction="column" alignItems="center">
        <div><StarDate /></div>
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

const SolarSystem = () => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <PlanetList />
      </Grid>
      <Grid item xs={4}>
        <SelectedPlanetInfo />
      </Grid>
    </Grid>
  )
}

export default SolarSystem