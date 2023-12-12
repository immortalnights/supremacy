import { Box, Typography, Button, Stack } from "@mui/material"
import React from "react"
import Recoil from "recoil"
import { IOContext } from "../../data/IOContext"
import { IPlanet, IShip, ShipID } from "@server/simulation/types"
import PlanetAuth from "../components/PlanetAuth"
import DockingBays from "../components/DockingBays"
import { Ship, PlayerShipsAtPlanetPosition } from "../../data/Ships"
import { range } from "../../data/utilities"

interface IPlanetSlotProps {
    ship: IShip | undefined
    onToggleStatus: (
        event: React.MouseEvent<HTMLButtonElement>,
        state: string
    ) => void
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

const PlanetSlot = ({ ship, onToggleStatus, onClick }: IPlanetSlotProps) => {
    let empty = true
    let canToggleStatus = false
    let name = "Empty"
    let status = ""
    let toggleStatus = ""

    if (ship) {
        empty = false
        name = ship.name
        if (ship.harvester && ship.harvester.location === "surface") {
            canToggleStatus = ship.crew > 0
            if (ship.task === "harvesting") {
                status = "Running"
                toggleStatus = "activate"
            } else {
                status = "Not Running"
                toggleStatus = "deactivate"
            }
        }
    }

    return (
        <div
            style={{
                marginTop: 8,
                padding: 2,
                border: "1px solid lightgrey",
                flexGrow: "1",
                flexBasis: "16.6%",
            }}
        >
            <div>
                <Button
                    sx={{ display: "block", margin: "0 auto" }}
                    onClick={(event) => onToggleStatus(event, toggleStatus)}
                    disabled={!canToggleStatus}
                >
                    On / Off
                </Button>
            </div>
            <div onClick={onClick} style={{ cursor: "pointer" }}>
                <div
                    style={{
                        height: 64,
                        width: 64,
                        backgroundColor: "lightgray",
                        margin: "auto",
                    }}
                >
                    <img src="" alt="" />
                </div>
                <Typography
                    textAlign="center"
                    color={empty ? "gray" : "default"}
                >
                    {name}
                </Typography>
                <Typography textAlign="center">{status}</Typography>
            </div>
        </div>
    )
}

const Surface = ({ planet }: { planet: IPlanet }) => {
    const ships = Recoil.useRecoilValue(
        PlayerShipsAtPlanetPosition({ planet: planet.id, position: "surface" })
    ) as IShip[]
    const [selectedShip, setSelectedShip] = React.useState<ShipID | undefined>()
    const ship = Recoil.useRecoilValue(Ship(selectedShip))
    const { action } = React.useContext(IOContext)

    const handleClickDockedShip = (
        event: React.MouseEvent<HTMLLIElement>,
        ship: IShip
    ) => {
        action("ship-relocate", { id: ship.id, position: "surface" })
    }

    const handleToggleSlot = (
        event: React.MouseEvent<HTMLButtonElement>,
        slot: number,
        ship: IShip | undefined,
        state: string
    ) => {
        if (ship) {
            action("ship-toggle-surface-status", {
                id: ship.id,
                location: planet.id,
                position: "docking-bay",
            })
        }
    }

    const handleClickSlot = (
        event: React.MouseEvent<HTMLDivElement>,
        slot: number,
        ship: IShip | undefined
    ) => {
        if (ship) {
            action("ship-relocate", { id: ship.id, position: "docking-bay" })
        }
    }

    const slots: React.ReactNode[] = []
    range(6).forEach((slot) => {
        const ship = ships[slot]
        slots.push(
            <PlanetSlot
                key={slot}
                ship={ship}
                onToggleStatus={(event, state) =>
                    handleToggleSlot(event, slot, ship, state)
                }
                onClick={(event) => handleClickSlot(event, slot, ship)}
            />
        )
    })

    return (
        <>
            <div style={{ backgroundColor: "lightgray", height: 200 }}>
                {/* Image */}
            </div>
            <Stack direction="row" justifyContent="space-around">
                <Box flexBasis="20%">
                    <DockingBays
                        planet={planet}
                        selected={ship?.id}
                        onItemClick={handleClickDockedShip}
                    />
                </Box>
                <Stack direction="row" flexGrow="1">
                    {slots}
                </Stack>
            </Stack>
        </>
    )
}

const Authed = () => {
    return (
        <PlanetAuth view={(planet: IPlanet) => <Surface planet={planet} />} />
    )
}

export default Authed
