import React from "react"
import Recoil from "recoil"
import { Box, Button, IconButton, Grid, Typography } from "@mui/material"
import { ArrowDropDown, ArrowDropUp, ArrowLeft, ArrowRight } from "@mui/icons-material"
import { PlatoonStatus } from "../../simulation/types"
import { IPlanet } from "../../simulation/types.d"
import PlanetAuth from "../components/PlanetAuth"
import { Suits, Weapons } from "../../data/StaticData"
import { PlayerPlatoons } from "../../data/Platoons"
import { IOContext } from "../../data/IOContext"
import { Player } from "../../data/Player"
import IncDecButton from "../components/IncreaseDecreaseButton"


const Equipment = ({ items, canChange, onChange }: { items: any, canChange: boolean, onChange: (key: string) => void }) => {
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
    onChange(keys[next])
  }
  const handlePrevClick = () => {
    let prev = index - 1
    if (prev < 0)
    {
      prev = keys.length - 1
    }
    setIndex(prev)
    onChange(keys[prev])
  }

  return (
    <Box sx={{ margin: "0 1rem" }}>
      <Typography variant="caption">Cost {equipment.cost} CR</Typography>
      <div style={{ backgroundColor: "lightgray", height: 180 }}></div>
      <div>
        <IconButton size="small" disabled={!canChange} onClick={handlePrevClick}><ArrowLeft /></IconButton>
        <IconButton size="small" disabled={!canChange} onClick={handleNextClick}><ArrowRight /></IconButton>
      </div>
    </Box>
  )
}

const Training = ({ planet }: { planet: IPlanet }) => {
  const player = Recoil.useRecoilValue(Player)
  const platoons = Recoil.useRecoilValue(PlayerPlatoons)
  const [ platoonIndex, setPlatoonIndex ] = React.useState(0)
  const selectedPlatoon = platoons.at(platoonIndex)
  const suits = Recoil.useRecoilValue(Suits)
  const weapons = Recoil.useRecoilValue(Weapons)
  const { action } = React.useContext(IOContext)

  const handleChangePlatoon = (event: any, direction: number) => {
    let nextIndex = platoonIndex + direction
    if (nextIndex < 0)
    {
      nextIndex = platoons.length - 1
    }
    else if (nextIndex >= platoons.length)
    {
      nextIndex = 0
    }

    setPlatoonIndex(nextIndex)
  }

  const handleChangePlatoonTroops = (event: any, amount: number) => {
    if (selectedPlatoon)
    {
      if (amount < 0)
      {
        if (selectedPlatoon.troops > 0)
        {
          action("platoon-modify", { platoon: selectedPlatoon.id, amount })
        }
      }
      else
      {
        if (selectedPlatoon.troops < 200)
        {
          action("platoon-modify", { platoon: selectedPlatoon.id, amount })
        }
      }
    }
  }

  const handleChangeSuit = (key: string) => {
    // FIXME does this need to be a request? recruit could include the equipment ids
    action("platoon-modify", { platoon: selectedPlatoon?.id, suit: key })
  }

  const handleChangeWeapon = (key: string) => {
    // FIXME does this need to be a request? recruit could include the equipment ids
    action("platoon-modify", { platoon: selectedPlatoon?.id, weapon: key })
  }

  const handleRecruitClick = (event: any) => {
    action("platoon-recruit", { platoon: selectedPlatoon?.id })
  }

  const handleDismissClick = (event: any) => {
    action("platoon-dismiss", {  platoon: selectedPlatoon?.id })
  }

  let location = ""
  if (selectedPlatoon)
  {
    // FIXME show ship or planet name
    if (selectedPlatoon.status === PlatoonStatus.Recruited)
    {
      if (selectedPlatoon.location.planet !== undefined)
      {
        location = "On planet"
      }
      else if (selectedPlatoon.location.ship !== undefined)
      {
        location = "On ship"
      }
    }
    else
    {
      location = "??"
    }
  }

  let canRecruit = false
  let canDismiss = false
  let canModify = false
  let canIncreaseTroops = false
  let canDecreaseTroops = false

  if (selectedPlatoon)
  {
    canRecruit = selectedPlatoon.status === PlatoonStatus.Training // && selectedPlatoon.troops > 200
    canDismiss = selectedPlatoon.status === PlatoonStatus.Recruited
    canModify = selectedPlatoon.status !== PlatoonStatus.Recruited
    canIncreaseTroops = canModify && selectedPlatoon.troops < 200
    canDecreaseTroops = canModify && selectedPlatoon.troops > 0
  }

  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography variant="caption">Platoon</Typography>
        <Typography variant="caption">{selectedPlatoon?.name}</Typography>
        <div>
          <IconButton size="small" onClick={(event) => handleChangePlatoon(event, 1)}><ArrowDropUp /></IconButton>
          <IconButton size="small" onClick={(event) => handleChangePlatoon(event, -1)}><ArrowDropDown /></IconButton>
        </div>
      </Grid>
      <Grid item xs={4}>
       <Typography variant="caption">Troops</Typography>
        <Typography variant="caption">{selectedPlatoon?.troops}</Typography>
        <div>
          <IncDecButton mode="increase" disabled={!canIncreaseTroops} onChange={handleChangePlatoonTroops} grayscale />
          <IncDecButton mode="decrease" disabled={!canDecreaseTroops} onChange={handleChangePlatoonTroops} grayscale />
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="caption">Civilians</Typography>
        <Typography variant="caption">{planet.population}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Equipment items={suits} canChange={canModify} onChange={handleChangeSuit} />
      </Grid>
      <Grid item xs={3}>
        <Equipment items={weapons} canChange={canModify} onChange={handleChangeWeapon} />
      </Grid>
      <Grid item xs={6}>
        <div>
          <Typography variant="caption">Location</Typography>
          <Typography variant="caption">{location}</Typography>
        </div>
        <div>
          <Typography variant="caption">Credits</Typography>
          <Typography variant="caption">{planet.resources.credits}</Typography>
        </div>
        <div>
          <Typography variant="caption">Rank</Typography>
          <Typography variant="caption">{selectedPlatoon?.rank}</Typography>
        </div>
        <Typography variant="caption">...description...</Typography>
        <div>
          <Button disabled={!canRecruit} onClick={handleRecruitClick}>Recruit</Button>
          <Button disabled={!canDismiss} onClick={handleDismissClick}>Dismiss</Button>
        </div>
        <div>
          <Typography variant="caption">Calibre</Typography>
          <Typography variant="caption">{selectedPlatoon?.calibre}</Typography>
        </div>
        <div>
          <Typography variant="caption">{selectedPlatoon?.status === PlatoonStatus.Training ? "Training" : ""}</Typography>
        </div>
      </Grid>
    </Grid>
  )
}

const Authed = () => {
  return (<PlanetAuth view={(planet: IPlanet) => (<Training planet={planet} />)} />)
}

export default Authed