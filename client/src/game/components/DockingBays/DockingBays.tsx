import React from "react"
import Recoil from "recoil"
import { Typography } from "@mui/material"
import { range } from "../../../data/utilities"
import { IPlanet, ShipID, IShip } from "../../../simulation/types.d"
import { PlayerShipsAtPlanetPosition } from "../../../data/Ships"

interface DockingBaysProps {
    planet: IPlanet
    selected: ShipID | undefined
    onItemClick: (event: React.MouseEvent<HTMLLIElement>, ship: IShip) => void
}

const DockingBays = ({ planet, selected, onItemClick }: DockingBaysProps) => {
    const ships = Recoil.useRecoilValue(
        PlayerShipsAtPlanetPosition({
            planet: planet.id,
            position: "docking-bay",
        })
    ) as IShip[]

    const handleItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        item: IShip
    ) => {
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
                            style={{
                                cursor: "pointer",
                                fontWeight:
                                    ship && selected === ship.id
                                        ? "bold"
                                        : "normal",
                            }}
                            onClick={(event) =>
                                ship && handleItemClick(event, ship)
                            }
                        >
                            {ship ? ship.name : "Bay Empty"}
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}

export default DockingBays
