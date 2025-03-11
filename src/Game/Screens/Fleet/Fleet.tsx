import { useEffect, useState } from "react"
import DockingBay from "../../components/DockingBay"
import launchIcon from "/images/launch.png"
import travelIcon from "/images/travel.png"
import dockIcon from "/images/dock.png"
import decommissionIcon from "/images/decommission.png"
import renameIcon from "/images/rename_ship.png"
import Button from "components/Button"
import ShipDetails from "./components/ShipDetails"
import ShipHeading from "./components/ShipHeading"
import Navigation from "../../components/Navigation"
import { useAtomValue } from "jotai"
import { planetsAtom, shipsAtom } from "../../store"
import { ColonizedPlanet, Planet, Ship } from "Supremacy/entities"
import FleetGrid from "../../components/FleetGrid"
import ShipIcon from "../../components/ShipIcon"
import {
    useDecommission,
    useMoveShip,
    useSelectedColonizedPlanet,
    useTransferShip,
} from "../../hooks"
import { throwError } from "game-signaling-server/client"
import PlanetGrid from "Game/components/PlanetGrid"
import Screen from "Game/components/Screen"
import Notification, { useSetNotification } from "Game/components/Notification"
import { isColonizedPlanet } from "Supremacy/planets"
import { assertNever } from "utilities"

const getPlanet = (planets: Planet[], id: string) => {
    const planet = planets.find((planet) => planet.id === id)
    if (!planet) {
        throw new Error(`Failed to find planet ${id}`)
    }
    return planet
}

const getShipPositionMessage = (ship: Ship, planets: Planet[]) => {
    let message: string = ""
    const position = ship.position
    switch (position) {
        case "docked": {
            const planet = getPlanet(planets, ship.location.planet)
            message = `${ship.name} is in a docking bay on ${planet.name}`
            break
        }
        case "orbit": {
            const planet = getPlanet(planets, ship.location.planet)
            message = `${ship.name} is in orbit above ${planet.name}`
            break
        }
        case "outer-space": {
            const destination = getPlanet(planets, ship.heading.to)
            if (destination && isColonizedPlanet(destination)) {
                message = `${ship.name} is is transit to  ${destination.name}: ETA ${ship.heading.remaining}`
            }
            break
        }
        case "surface": {
            const planet = getPlanet(planets, ship.location.planet)
            message = `${ship.name} is on the surface of ${planet.name}`
            break
        }
        default: {
            assertNever(position)
        }
    }

    return message
}

const useSelectedShip = () => {
    const ships = useAtomValue(shipsAtom)
    const planets = useAtomValue(planetsAtom)
    const [selectedShip, setSelectedShip] = useState<Ship["id"] | undefined>()
    let ship: Ship | undefined
    if (selectedShip) {
        ship = ships.find((item) => item.id === selectedShip)
    }
    const notify = useSetNotification()

    useEffect(() => {
        if (ship) {
            notify(getShipPositionMessage(ship, planets))
        }
    }, [ship, ship?.position])

    return [ship, setSelectedShip] as const
}

export default function Fleet() {
    const [ship, setSelectedShip] = useSelectedShip()
    const planets = useAtomValue(planetsAtom)

    const planet =
        useSelectedColonizedPlanet() ??
        throwError("Cannot view Fleet of lifeless planet")

    const [isSelectingDestination, setIsSelectingDestination] = useState(false)
    const move = useMoveShip()
    const travel = useTransferShip()
    const decommission = useDecommission()
    const notify = useSetNotification()

    const handleShipSelected = (ship: Ship) => {
        notify(getShipPositionMessage(ship, planets))
        setSelectedShip(ship.id)
    }

    const handleSelectDestination = (target: Planet) => {
        if (ship) {
            travel(ship, target)
        }
        setIsSelectingDestination(false)
    }

    const handleLaunchShip = () => {
        if (ship) {
            move(ship, "orbit")
        }
        setIsSelectingDestination(false)
    }

    const handleTransferShip = () => {
        if (ship) {
            if (ship.position === "orbit") {
                notify("Select planet to travel to", { timeout: false })
                setIsSelectingDestination(true)
            } else {
                notify(`Ship ${ship.name} is not in orbit`)
            }
        }
    }

    const handleDockShip = () => {
        if (ship) {
            move(ship, "docked")
        }
        setIsSelectingDestination(false)
    }

    const handleDecommissionShip = () => {
        if (ship) {
            decommission(ship)
        }
        setIsSelectingDestination(false)
    }

    const handleRenameShip = () => {}

    useEffect(() => {}, [ship?.position])

    let grid
    if (isSelectingDestination) {
        grid = <PlanetGrid onClick={handleSelectDestination} />
    } else {
        grid = <FleetGrid onClick={handleShipSelected} />
    }

    return (
        <Screen flexDirection="column">
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
                <Notification />
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
        </Screen>
    )
}
