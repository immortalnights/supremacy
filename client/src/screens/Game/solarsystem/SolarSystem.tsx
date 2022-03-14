import React from "react"
import { Button, Grid } from "@mui/material"
import { useLocalStorageValue } from "../../../data/localStorage"
import { IPlanet } from "../../../simulation/types"

const PlanetList = () => {
  const [ planets, setPlanets ] = React.useState<IPlanet[]>([])
  const currentPlayerId = useLocalStorageValue("player") as string
  const currentGameId = useLocalStorageValue("game") as string

  const fetchPlanets = () => {
    return fetch("/api/planets", {
      headers: {
        "Content-Type": "application/json",
        "X-Player-ID": currentPlayerId,
        "X-Game-ID": currentGameId,
      }
    })
    .then((r) => r.json())
  }

  React.useEffect(() => {
    const fetch = () => {
      fetchPlanets()
      .then((r) => {
        if (r.ok)
        {
          setPlanets(r.planets)
        }
      })
    }

    const poller = window.setInterval(fetch, 1000)
    fetch()

    return () => {
      clearInterval(poller)
    }
  }, [])

  return (
    <ul>
      {planets.map((planet) => (
        <li key={planet.id}>{planet.name}</li>
      ))}
    </ul>
  )
}

const Planets = () => {
  return (
    <React.Suspense fallback={"Loading..."}>
      <PlanetList />
    </React.Suspense>
  )
}

const SolarSystem = () => {
  return (
    <Grid container>
      <Grid item xs={2} />
      <Grid item xs={4}>
        <Planets />
      </Grid>
      <Grid item xs={4}>
        <div>
          <div>stardate</div>
          <div>image</div>
          <div>display name</div>
        </div>
        <div>
          <Button>Terraform</Button>
          <Button>Espionage</Button>
        </div>
      </Grid>
      <Grid item xs={2} />
    </Grid>
  )
}

export default SolarSystem