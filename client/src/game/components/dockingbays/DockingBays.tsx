import React from "react"
import Recoil from "recoil"
import { range } from "../../../data/utilities"
import { Stack, Typography  } from "@mui/material"
import { IPlanet, IShip } from "../../../simulation/types.d"
import { PlayerShipsAtPlanetPosition } from "../../../data/Ships"

const DockingBays = ({ planet }: { planet: IPlanet }) => {
  const ships = Recoil.useRecoilValue(PlayerShipsAtPlanetPosition({ planet: planet.id, position: "docking-bay" })) as IShip[]

  const handleItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, item: IShip) => {

  }

  return (
    <div>
      <Typography variant="caption">Planet</Typography>
      <Typography>{planet.name}</Typography>
      <Typography variant="caption">Docking Bays</Typography>
      <ol>
        {range(3).map((index) => {
          const ship = ships[index]
          return (
            <li key={index} onClick={(event) => ship && handleItemClick(event, ship)}>{ship ? ship.name : "Bay Empty"}</li>
          )
        })}
      </ol>
    </div>
  )
}

export default DockingBays