import React from "react"
import Recoil from "recoil"
import { IPlayer, Player } from "../../data/Player"
import { SelectedPlanet } from "../../data/Planets"
import { Box, Grid, GridDirection, IconButton, Stack, Typography } from "@mui/material"
import DockingBays from "../components/DockingBays"
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material"
import { stringify } from "querystring"
import { PlatoonsOnPlanet, PlatoonsOnShip, IPlatoonBasic, IPlatoon, PlanetStrength, PlanetEnemyStrength } from "../../data/Platoons"
// import PlatoonGrid from "../components/grid/PlatoonGrid"
// import "./styles.css"
import type { IPlanet, IShip, ShipID } from "../../simulation/types.d"
import { Ship } from "../../data/Ships"

const PlatoonGridItem = ({ name, troops }: { name?: string, troops?: number }) => {
  return (
    <Grid item sx={{ margin: "1px 4px", display: "flex", flexDirection: "row", flexBasis: "30%" }}>
      <div style={{ border: "1px solid #6b6bf3", minWidth: "3em", minHeight: "1.7rem", margin: "1px", textAlign: "center" }}>{troops}</div>
      <div style={{ border: "1px solid #6b6bf3", minWidth: "2.5em", minHeight: "1.7rem", margin: "1px", textAlign: "center" }}>{name}</div>
    </Grid>
  )
}

interface PlatoonGridProps {
  items: IPlatoonBasic[]
  count: number
  direction: GridDirection
  onSelectItem: () => void
}

const PlatoonGrid = ({ items, count, direction, onSelectItem }: PlatoonGridProps) => {

  const cells: React.ReactNode[] = []

  for (let index = 0; index < count; index++)
  {
    cells.push(<PlatoonGridItem key={index} {...items[index]} />)
  }

  return (
    <Grid container direction={direction} sx={{  }}>
      {cells}
    </Grid>
  )
}


const ShipDetails = () => {
  const platoons = Recoil.useRecoilValue(PlatoonsOnShip({ ship: 0 }))

  const ship: { name: string } = {
    name: ""
  }

  const handleSelectedItem: any = () => {}

  return (
    <div>
      <Typography variant="caption">Ship</Typography>
      <Typography variant="caption">{ship?.name}</Typography>
      <PlatoonGrid items={platoons} count={4} direction="column" onSelectItem={handleSelectedItem} />
    </div>
  )
}


const Combat = ({ planet, owner }: { planet: IPlanet, owner: boolean }) => {
  const [ selectedShip, setSelectedShip ] = React.useState<ShipID | undefined>()
  const platoons = Recoil.useRecoilValue(PlatoonsOnPlanet({ planet: planet.id }))
  const strength = Recoil.useRecoilValue(PlanetStrength({ planet: planet.id }))
  const enemyStrength = Recoil.useRecoilValue(PlanetEnemyStrength({ planet: planet.id }))
  const ship = Recoil.useRecoilValue(Ship(selectedShip))
  const remainingTroops = platoons.reduce((val, p, index, arr) => val + (p as IPlatoon).troops, 0)
  const aggression = 25

  const handleSelectedItem: any = () => {}

  const handleClickDockedShip = (event: React.MouseEvent<HTMLLIElement>, ship: IShip) => {
    setSelectedShip(ship.id)
  }

  return (
    <Grid container>
      <Grid item xs={5}>
        <Stack direction="row">
          <DockingBays planet={planet} selected={ship?.id} onItemClick={handleClickDockedShip} />
          <ShipDetails />
        </Stack>
        <PlatoonGrid items={platoons} count={24} direction="row" onSelectItem={handleSelectedItem} />
      </Grid>
      <Grid item xs={2}>
        <div style={{ display: "flex", flexGrow: "1", height: "100%" }}>
          <div style={{ height: "100%", backgroundColor: "black", width: 20, margin: "0 0.15rem" }}></div>
          <div style={{ height: "100%", backgroundColor: "black", width: 20, margin: "0 0.15rem" }}></div>
        </div>
      </Grid>
      <Grid item xs={5}>
        <div>
          <div style={{ width: 160, height: 140, backgroundColor: "lightgray", margin: "0 34px" }}></div>
          <Typography component="p" variant="caption" sx={{ display: "flex", margin: "0 1rem"}}>
            <span>Your total strength</span>
            <span style={{ flexGrow: 1 }}></span>
            <span>{strength}</span>
          </Typography>
          <Typography component="p" variant="caption" sx={{ display: "flex", margin: "0 1rem"}}>
            <span>Total troops left</span>
            <span style={{ flexGrow: 1 }}></span>
            <span>{remainingTroops}</span>
          </Typography>
          <Typography component="p" variant="caption" sx={{ display: "flex", margin: "0 1rem"}}>
            <span>Enemy total strength</span>
            <span style={{ flexGrow: 1 }}></span>
            <span>{enemyStrength}</span>
          </Typography>
          {/* <Typography variant="caption">Scaling factor {scalingFactor}</Typography> */}

          <Stack direction="row" alignItems="center" style={{ border: "1px dashed lightgray", borderRadius: 4 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <IconButton size="small"><ArrowDropUp /></IconButton>
              <IconButton size="small"><ArrowDropDown /></IconButton>
            </div>
            <div style={{ width: 160, height: 120, backgroundColor: "lightgray", marginRight: 34 }}></div>
          </Stack>
          <Typography component="p" variant="caption" textAlign="center">{aggression}%</Typography>
        </div>
      </Grid>
    </Grid>
  )
}

// FIXME rename?
const AuthCombat = () => {
  const player = Recoil.useRecoilValue(Player) as IPlayer
  const planet = Recoil.useRecoilValue(SelectedPlanet) as IPlanet

  // Player can always see Planet, but the view does differ depending on ownership
  return (<Combat planet={planet} owner={planet.owner === player.id} />)
}

export default AuthCombat