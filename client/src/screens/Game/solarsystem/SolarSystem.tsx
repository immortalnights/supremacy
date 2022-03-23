import React from "react"
import Recoil from "recoil"
import { Box, Button, Grid, List, ListItemButton, ListItemAvatar, ListItemText } from "@mui/material"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { formatDate, SolarSystem as SolarSystemData, SelectedPlanet } from "../../../data/SolarSystem"
import { Planets as PlanetData } from "../../../data/Planets"
import { useLocalStorageValue } from "../../../data/localStorage"
import type { IPlanet, ISolarSystem } from "../../../simulation/types.d"
import { Game as GameData } from "../../../data/Game"

const StarDate = () => {
  const data = Recoil.useRecoilValue(SolarSystemData) as ISolarSystem

  return (
    <div>{data ? formatDate(data.date) : "-"}</div>
  )
}

const PlanetList = () => {
  const game = Recoil.useRecoilValue(GameData)
  const planets = Recoil.useRecoilValue(PlanetData)
  const [ selected, setSelected ] = Recoil.useRecoilState(SelectedPlanet)
  const navigate = useNavigate()

  const handlePlanetClick = (id: number) => {
    setSelected(id)
    navigate(`/game/${game?.id}/overview/${id}`)
  }
//<ListItemButton key={planet.id} component={RouterLink} to={`/game/${game?.id}/overview/${planet.id}`}>
  return (
    <List dense sx={{
      padding: "1em",
    }}>
      {planets.map((planet) => (
        <ListItemButton key={planet.id} onClick={() => handlePlanetClick(planet.id)} selected={planet.id === selected}>
          <ListItemAvatar />
          <ListItemText primary={`${planet.name}`} />
        </ListItemButton>
      ))}
    </List>
  )
}

const SolarSystem = () => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <PlanetList />
      </Grid>
      <Grid item xs={4}>
        <div>
          <div><StarDate /></div>
          <div>image</div>
          <div>display name</div>
        </div>
        <div>
          <Button>Terraform</Button>
          <Button>Espionage</Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default SolarSystem