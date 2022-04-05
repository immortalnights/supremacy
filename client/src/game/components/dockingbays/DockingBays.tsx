import React from "react"
import Recoil from "recoil"
import { Stack, Typography  } from "@mui/material"
import { IPlanet, IShip } from "../../../simulation/types.d"

const DockingBays = ({ planet }: { planet: IPlanet }) => {
  const items: (IShip | undefined)[] = new Array(3).fill(undefined)

  const handleItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, item: IShip) => {

  }

  return (
    <>
      <Typography variant="caption">Planet</Typography>
      <Typography>{planet.name}</Typography>
      <Typography variant="caption">Docking Bays</Typography>
      <ol>
        {items.map((item, index) => (
          <li key={index} onClick={(event) => item && handleItemClick(event, item)}>{item ? item.name : "Bay Empty"}</li>
        ))}
      </ol>
    </>
  )
}

export default DockingBays