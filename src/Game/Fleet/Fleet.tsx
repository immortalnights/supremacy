import DockingBay from "../../components/DockingBay"
import launchIcon from "/images/launch.png"
import travelIcon from "/images/travel.png"
import dockIcon from "/images/dock.png"
import decommissionIcon from "/images/decommission.png"
import renameIcon from "/images/rename_ship.png"
import Button from "../../components/Button"
import ShipDetails from "../../components/ShipDetails"
import ShipHeading from "../../components/ShipHeading"
import Navigation from "../../components/Navigation"
import { useAtomValue } from "jotai"
import { shipsAtom } from "../store"
import { Ship } from "../entities"
import FleetGrid from "../../components/FleetGrid"
import { useState } from "react"
import { useMoveShip } from "../Surface/commands"
import { useDecommission } from "../../commands"
import ShipIcon from "../../components/ShipIcon"
import { useSelectedColonizedPlanet } from "../dataHooks"
import { throwError } from "game-signaling-server/client"

const useSelectedShip = (id?: Ship["id"]) => {
    let ship
    const ships = useAtomValue(shipsAtom)
    if (id) {
        ship = ships.find((item) => item.id === id)
    }
    return ship
}

export default function Fleet() {
    const planet =
        useSelectedColonizedPlanet() ??
        throwError("Cannot view Fleet of lifeless planet")
    const [selectedShip, setSelectedShip] = useState<Ship["id"] | undefined>()
    const ship = useSelectedShip(selectedShip)
    const [isSelectingDestination, setIsSelectingDestination] = useState(false)
    const move = useMoveShip()
    const decommission = useDecommission()

    const handleShipSelected = (ship: Ship) => {
        setSelectedShip(ship.id)
    }

    const handleLaunchShip = () => {
        if (ship) {
            move(ship, planet, "orbit")
        }
    }
    const handleTransferShip = () => {
        if (ship) {
            setIsSelectingDestination(true)
            // move(ship, planet, "outer-space")
        }
    }
    const handleDockShip = () => {
        if (ship) {
            move(ship, planet, "docked")
        }
    }
    const handleDecommissionShip = () => {
        if (ship) {
            decommission(ship)
        }
    }
    const handleRenameShip = () => {}

    let grid
    if (isSelectingDestination) {
        grid = null
    } else {
        grid = <FleetGrid onClick={handleShipSelected} />
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                <DockingBay planet={planet} onClick={handleShipSelected} />
                <div>
                    <div>
                        <Button onClick={handleLaunchShip}>
                            <img src={launchIcon} />
                        </Button>
                        <Button onClick={handleTransferShip}>
                            <img src={travelIcon} />
                        </Button>
                        <Button onClick={handleDockShip}>
                            <img src={dockIcon} />
                        </Button>
                    </div>
                    <div>
                        <ShipDetails ship={ship} />
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Button onClick={handleDecommissionShip}>
                        <img src={decommissionIcon} />
                    </Button>
                    <Button onClick={handleRenameShip}>
                        <div style={{ position: "relative" }}>
                            <img src={renameIcon} />
                            {ship && (
                                <ShipIcon
                                    ship={ship}
                                    style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "22px",
                                    }}
                                />
                            )}
                        </div>
                    </Button>
                </div>
            </div>
            <div>
                <div style={{ background: "black", height: 64 }}></div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <Navigation
                    items={["combat", "shipyard", "cargo"]}
                    direction="column"
                />
                {grid}
                <ShipHeading ship={ship} />
                <Navigation
                    items={["surface", "overview", "training"]}
                    direction="column"
                />
            </div>
        </div>
    )
}
