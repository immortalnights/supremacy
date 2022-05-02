import React from "react"
import Recoil from "recoil"
import { range } from "../../../data/utilities"
import { Stack, Typography  } from "@mui/material"
import { IPlanet, IShip } from "../../../simulation/types.d"
import { PlayerShipsAtPlanetPosition } from "../../../data/Ships"

const DockingBays = ({ planet, onItemClick }: { planet: IPlanet, onItemClick: (event: React.MouseEvent<HTMLLIElement>, ship: IShip) => void }) => {
  const [ selected, setSelected ] = React.useState<number | undefined>()
  const ships = Recoil.useRecoilValue(PlayerShipsAtPlanetPosition({ planet: planet.id, position: "docking-bay" })) as IShip[]

  const handleItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number, item: IShip) => {
    if (item)
    {
      setSelected(index)
    }
    else
    {
      setSelected(undefined)
    }
    onItemClick(event, item)
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
            <li
              key={index}
              style={{ "cursor": "pointer", fontWeight: ship && selected === index ? "bold": "normal" }}
              onClick={(event) => ship && handleItemClick(event, index, ship)}>
                {ship ? ship.name : "Bay Empty"}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default DockingBays