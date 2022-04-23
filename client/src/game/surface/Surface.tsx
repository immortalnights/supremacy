import { Box, FormLabel, Typography, Button, Stack } from "@mui/material"
import React from "react"
import Recoil from "recoil"
import { IPlanet, IShip } from "../../simulation/types.d"
import PlanetAuth from "../components/PlanetAuth"
import DockingBays from "../components/dockingbays/"
import { PlayerShipsAtPlanetPosition } from "../../data/Ships"
import { range } from "../../data/utilities"

interface IPlanetSlotProps {
  ship: IShip | undefined
  onToggleStatus: (event: React.MouseEvent<HTMLButtonElement>, state: string) => void
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

const PlanetSlot = ({ ship, onToggleStatus, onClick }: IPlanetSlotProps) => {
  const empty = true
  let name = ""
  let status = ""

  if (ship)
  {
    name = ship.name
  }

	return (
		<div style={{ marginTop: 8, padding: 2, border: "1px solid lightgrey" }}>
			<div>
				<Button onClick={(event) => onToggleStatus(event, "activate")} disabled={empty}>On</Button>
				<Button onClick={(event) => onToggleStatus(event, "deactivate")} disabled={empty}>Off</Button>
			</div>
			<div onClick={onClick} style={{ cursor: "pointer" }}>
				<div style={{ height: 64, width: 64, backgroundColor: "lightgray", margin: "auto" }}><img src="" alt="Empty"/></div>
				<div>{name}</div>
				<div>{status}</div>
			</div>
		</div>
	)
}

const Surface = ({ planet }: { planet: IPlanet }) => {
  const ships = Recoil.useRecoilValue(PlayerShipsAtPlanetPosition({ planet: planet.id, position: "surface" })) as IShip[]

  const handleClickDockedShip = (event: React.MouseEvent<HTMLLIElement>, ship: IShip) => {

  }

  const handleToggleSlot = (event: React.MouseEvent<HTMLButtonElement>, slot: number, state: string) => {

  }

  const handleClickSlot = (event: React.MouseEvent<HTMLDivElement>, slot: number) => {

  }

  const slots: React.ReactNode[] = []
  range(6).forEach((slot) => {
    const ship = ships[slot]
    slots.push(<PlanetSlot
      key={slot}
      ship={ship}
      onToggleStatus={(event, state) => handleToggleSlot(event, slot, state)}
      onClick={(event) => handleClickSlot(event, slot)}
    />)
  })

  return (
    <>
      <div style={{ backgroundColor: "lightgray", height: 200, }} >
        {/* Image */}
      </div>
      <Stack direction="row" justifyContent="space-around">
        <Box>
          <DockingBays planet={planet} onItemClick={handleClickDockedShip} />
        </Box>
        <Stack direction="row">
          {slots}
        </Stack>
      </Stack>
    </>
  )
}

const Authed = () => {
  return (<PlanetAuth view={(planet: IPlanet) => (<Surface planet={planet} />)} />)
}

export default Authed