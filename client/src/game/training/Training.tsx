import React from "react"
import Recoil from "recoil"
import { Box, Button, IconButton, Grid, Typography } from "@mui/material"
import { ArrowDropDown, ArrowDropUp, ArrowLeft, ArrowRight } from "@mui/icons-material"
import { IPlanet } from "../../simulation/types.d"
import PlanetAuth from "../components/PlanetAuth"
import { Suits, Weapons } from "../../data/StaticData"


const Equipment2 = ({ items }: { items: any }) => {
  const [ index, setIndex ] = React.useState(0)
  const keys = Object.keys(items)
  const equipment = items[keys[index]] as any

  const handleNextClick = () => {
    let next = index + 1
    if (next >= keys.length)
    {
      next = 0
    }
    setIndex(next)
  }
  const handlePrevClick = () => {
    let prev = index - 1
    if (prev < 0)
    {
      prev = keys.length - 1
    }
    setIndex(prev)
  }

  return (
    <Box sx={{ margin: "0 1rem" }}>
      <Typography variant="caption">Cost {equipment.cost} CR</Typography>
      <div style={{ backgroundColor: "lightgray", height: 180 }}></div>
      <div>
        <IconButton size="small" onClick={handlePrevClick}><ArrowLeft /></IconButton>
        <IconButton size="small" onClick={handleNextClick}><ArrowRight /></IconButton>
      </div>
    </Box>
  )
}


const Training = ({ planet }: { planet: IPlanet }) => {
  const [ selectedWeapon, setSelectedWeapon ] = React.useState(0)
  const suits = Recoil.useRecoilValue(Suits)
  const weapons = Recoil.useRecoilValue(Weapons)

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
        {/* <Equipment items={suitKeys} selector={suitSelector} /> */}
        <Equipment2 items={suits} />
      </Grid>
      <Grid item xs={3}>
        {/* <Equipment items={weaponKeys} selector={weaponSelector} /> */}
        <Equipment2 items={weapons} />
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