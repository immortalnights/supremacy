import React from "react"
import Recoil from "recoil"
import { Box, Button, IconButton, Grid, Typography, Stack } from "@mui/material"
import { ArrowDropDown, ArrowDropUp, ArrowLeft, ArrowRight } from "@mui/icons-material"
import { PlatoonStatus } from "../../simulation/types"
import { IPlanet } from "../../simulation/types.d"
import PlanetAuth from "../components/PlanetAuth"
import { Suits, Weapons } from "../../data/StaticData"
import { PlayerPlatoons, IPlatoon } from "../../data/Platoons"
import { IOContext } from "../../data/IOContext"
import { Player } from "../../data/Player"
import IncDecButton from "../components/IncreaseDecreaseButton"

const calculateCost = (troops: number, suit: number, weapon: number) => {
  return troops * (suit + weapon)
}

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
    <Box sx={{ margin: "0 auto" }}>
      <Typography variant="caption">Cost {equipment.cost} CR</Typography>
      <div style={{ backgroundColor: "lightgray", height: 180, width: 220 }}>{equipment.name}</div>
      <div>
        <IconButton size="small" disabled={!canChange} onClick={handlePrevClick}><ArrowLeft /></IconButton>
        <IconButton size="small" disabled={!canChange} onClick={handleNextClick}><ArrowRight /></IconButton>
      </div>
    </Box>
  )
}

const PlatoonDescription = ({ platoon }: { platoon: IPlatoon }) => {
  const suits = Recoil.useRecoilValue(Suits)
  const weapons = Recoil.useRecoilValue(Weapons)

  let description: React.ReactElement | null = null
  switch (platoon.status)
  {
    case PlatoonStatus.None:
    case PlatoonStatus.Defeated:
    case PlatoonStatus.Training:
    {
      const suit = suits[platoon.suit as keyof typeof suits]
      const weapon = weapons[platoon.equipment as keyof typeof weapons]
      description = (
        <>
          <Grid item xs={12} md={6} textAlign="center"><Typography variant="caption">Cost</Typography></Grid>
          <Grid item xs={12} md={6} textAlign="center"><Typography variant="body1">{calculateCost(platoon.troops, suit.cost, weapon.cost)} Credits</Typography></Grid>
        </>
      )
      break
    }
    case PlatoonStatus.Recruited:
    {
      description = (
        <Grid item md={12} textAlign="center">
          <Typography variant="body1">Platoon recruited</Typography>
        </Grid>
      )
      break
    }
  }

  return description
}

const PlatoonDetails = ({ platoon, planetCredits, onRecruit, onDismiss }: { platoon: IPlatoon, planetCredits: number, onRecruit: () => void, onDismiss: () => void }) => {
  const canRecruit = platoon && platoon.status === PlatoonStatus.Training
  const canDismiss = platoon && platoon.status === PlatoonStatus.Recruited

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={12} md={6} textAlign="center"><Typography variant="caption">Location</Typography></Grid>
      <Grid item xs={12} md={6} textAlign="center"><Typography variant="body1">{platoon.location.planet || platoon.location.ship}</Typography></Grid>

      <Grid item xs={12} md={6} textAlign="center"><Typography variant="caption">Credits</Typography></Grid>
      <Grid item xs={12} md={6} textAlign="center"><Typography variant="body1">{planetCredits}</Typography></Grid>

      <PlatoonDescription platoon={platoon} />

      <Grid item xs={12} md={6} textAlign="center"><Typography variant="caption">Rank</Typography></Grid>
      <Grid item xs={12} md={6} textAlign="center"><Typography variant="body1">{platoon.rank}</Typography></Grid>

      <Grid item xs={12} md={6} textAlign="center"><Typography variant="caption">Calibre</Typography></Grid>
      <Grid item xs={12} md={6} textAlign="center"><Typography variant="body1">{Math.floor(platoon.calibre)}%</Typography></Grid>

      <Grid item xs={12} md={12} textAlign="center">
        {platoon.status === PlatoonStatus.Training &&
          <Typography component="span" variant="body2" color="text.secondary" className="wavey">
            {"Training".split("").map((l, index) => (
              <span key={index} style={{"--i": index + 1} as React.CSSProperties}>{l}</span>
            ))}
          </Typography>
        || "-"}
      </Grid>

      <Grid item xs={12} md={12} textAlign="center">
        <Button disabled={!canRecruit} onClick={onRecruit}>Recruit</Button>
        <Button disabled={!canDismiss} onClick={onDismiss}>Dismiss</Button>
      </Grid>
    </Grid>
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

  const handleRecruit = () => {
    action("platoon-recruit", { platoon: selectedPlatoon!.id })
  }

  const handleDismiss = () => {
    action("platoon-dismiss", {  platoon: selectedPlatoon!.id })
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

  let canModify = false
  let canIncreaseTroops = false
  let canDecreaseTroops = false

  const details: {
    location: string
    planetCredits: number
    rank: string
    description: string
    calibre: number
    status?: PlatoonStatus
  } = {
    location: "",
    planetCredits: planet.resources.credits,
    rank: "",
    description: "",
    calibre: 0,
    status: undefined
  }

  if (selectedPlatoon)
  {
    canModify = selectedPlatoon.status !== PlatoonStatus.Recruited
    canIncreaseTroops = canModify && selectedPlatoon.troops < 200
    canDecreaseTroops = canModify && selectedPlatoon.troops > 0

    details.location = "-"
    details.rank = selectedPlatoon.rank
    details.calibre = selectedPlatoon.calibre
    details.status = selectedPlatoon.status


    details.description = ""
  }

  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography variant="caption">Platoon</Typography>
        <Typography variant="body1">{selectedPlatoon?.name}</Typography>
        <div>
          <IconButton size="small" onClick={(event) => handleChangePlatoon(event, 1)}><ArrowDropUp /></IconButton>
          <IconButton size="small" onClick={(event) => handleChangePlatoon(event, -1)}><ArrowDropDown /></IconButton>
        </div>
      </Grid>
      <Grid item xs={4}>
       <Typography variant="caption">Troops</Typography>
        <Typography variant="body1">{selectedPlatoon?.troops}</Typography>
        <div>
          <IncDecButton mode="increase" disabled={!canIncreaseTroops} onChange={handleChangePlatoonTroops} grayscale />
          <IncDecButton mode="decrease" disabled={!canDecreaseTroops} onChange={handleChangePlatoonTroops} grayscale />
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="caption">Civilians</Typography>
        <Typography variant="body1">{planet.population}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="row" alignItems="center" justifyContent="space-evenly">
          <Grid xs={4}><Equipment items={suits} canChange={canModify} onChange={handleChangeSuit} /></Grid>
          <Grid xs={4}><Equipment items={weapons} canChange={canModify} onChange={handleChangeWeapon} /></Grid>
          <Grid xs={4}>
            {selectedPlatoon && <PlatoonDetails platoon={selectedPlatoon} planetCredits={planet.resources.credits} onRecruit={handleRecruit} onDismiss={handleDismiss} />}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const Authed = () => {
  return (<PlanetAuth view={(planet: IPlanet) => (<Training planet={planet} />)} />)
}

export default Authed