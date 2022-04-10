import React from "react"
import Recoil from "recoil"
import { Box, Button, Grid, Typography } from "@mui/material"
import { IPlanet } from "../../simulation/types.d"
import PlanetAuth from "../components/PlanetAuth"
import { ArrowDropDown, ArrowDropUp, ArrowLeft, ArrowRight } from "@mui/icons-material"


const Training = ({ planet }: { planet: IPlanet }) => {
  const suit = {
    cost: 0,
  }
  const weapon = {
    cost: 0,
  }

  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography variant="caption">Platoon</Typography>
        <Typography variant="caption">1st</Typography>
        <div>
          <ArrowDropUp />
          <ArrowDropDown />
        </div>
      </Grid>
      <Grid item xs={4}>
       <Typography variant="caption">Troops</Typography>
        <Typography variant="caption">0</Typography>
        <div>
          <ArrowDropUp />
          <ArrowDropDown />
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="caption">Civilians</Typography>
        <Typography variant="caption">{planet.population}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Box sx={{ margin: "0 1rem" }}>
          <Typography variant="caption">Suit Cost {suit.cost} CR</Typography>
          <div style={{ backgroundColor: "lightgray", height: 180 }}></div>
          <div>
            <ArrowLeft />
            <ArrowRight />
          </div>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <Box sx={{ margin: "0 1rem" }}>
          <Typography variant="caption">Cost {weapon.cost} CR</Typography>
          <div style={{ backgroundColor: "lightgray", height: 180 }}></div>
          <div>
            <ArrowLeft />
            <ArrowRight />
          </div>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <div>
          <Typography variant="caption">Location</Typography>
          <Typography variant="caption"></Typography>
        </div>
        <div>
          <Typography variant="caption">Credits</Typography>
          <Typography variant="caption">{planet.resources.credits}</Typography>
        </div>
        <div>
          <Typography variant="caption">Rank</Typography>
          <Typography variant="caption">Cadet</Typography>
        </div>
        <Typography variant="caption">...description...</Typography>
        <div>
          <Button>Recruit</Button>
          <Button>Dismiss</Button>
        </div>
        <div>
          <Typography variant="caption">Calibre</Typography>
          <Typography variant="caption">0</Typography>
        </div>
        <div>
          <Typography variant="caption">Training / Not training</Typography>
        </div>
      </Grid>
    </Grid>
  )
}

const Authed = () => {
  return (<PlanetAuth view={(planet: IPlanet) => (<Training planet={planet} />)} />)
}

export default Authed