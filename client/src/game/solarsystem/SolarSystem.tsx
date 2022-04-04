import React from "react"
import Recoil from "recoil"
import { Button, Grid, List, ListItemButton, ListItemAvatar, ListItemText } from "@mui/material"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { SelectedPlanet } from "../../data/General"
import { Planets as PlanetData } from "../../data/Planets"
import { Game as GameData } from "../../data/Game"
import { StarDate } from "../components/StarDate"


const PlanetList = () => {
  const game = Recoil.useRecoilValue(GameData)
  const planets = Recoil.useRecoilValue(PlanetData)
  const [ selected, setSelected ] = Recoil.useRecoilState(SelectedPlanet)
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