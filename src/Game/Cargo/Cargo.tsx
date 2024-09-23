import Button from "../../components/Button"
import DockingBay from "../../components/DockingBay"
import Metadata, { MetadataValue } from "../../components/Metadata"
import Navigation from "../../components/Navigation"
import ShipIcon from "../../components/ShipIcon"
import yellowUp from "/images/yellow_up.png"
import yellowDown from "/images/yellow_down.png"
import civilians from "/images/civilians.png"
import fuel from "/images/fuel.png"
import crew from "/images/crew.png"
import unload from "/images/unload.png"
import decommission from "/images/decommission2.png"
import loadCargo from "/images/load_cargo.png"
import unloadCargo from "/images/unload_cargo.png"
import { CargoType, ColonizedPlanet, Ship } from "../entities"
import { useAtomValue } from "jotai"
import { shipsAtom } from "../store"
import { MouseEvent, useState } from "react"
import { useDecommission } from "../actions"
import { useSelectedColonizedPlanet } from "../dataHooks"
import { throwError } from "game-signaling-server/client"
import { getModifierAmount } from "../utilities"
import {
    useCrewShip,
    useLoadCargo,
    useLoadFuel,
    useLoadPassengers,
    useUnloadShip,
} from "./actions"

function CargoItem({
    cargo,
    label,
    planet,
    ship,
}: {
    cargo: CargoType
    label: string
    planet: ColonizedPlanet
    ship?: Ship
}) {
    const [load, unload] = useLoadCargo()

    const handleLoadCargo = (event: MouseEvent) => {
        if (ship) {
            load(ship, cargo, getModifierAmount(event, ship.capacity.cargo))
        }
    }

    const handleUnloadCargo = (event: MouseEvent) => {
        if (ship) {
            unload(ship, cargo, -getModifierAmount(event, ship.capacity.cargo))
        }
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={handleLoadCargo}>
                    <img src={unloadCargo} />
                </Button>
                <Button onClick={handleUnloadCargo}>
                    <img src={loadCargo} />
                </Button>
            </div>
            <div style={{ textAlign: "center" }}>{label}</div>
            <div>
                <MetadataValue label="" value={planet[cargo]} />
                <MetadataValue label="" value={ship?.cargo[cargo] ?? ""} />
            </div>
        </div>
    )
}

function ShipCargoDetails({
    ship,
    planet: { population },
}: {
    ship?: Ship
    planet: ColonizedPlanet
}) {
    const totalCargo = ship ? 0 : undefined
    return (
        <div>
            <Metadata label="Ship" value={ship?.name ?? ""} />
            <Metadata label="Civilians" value={population ?? ""} />
            <Metadata label="Seats" value={ship?.capacity.civilians ?? ""} />
            <Metadata label="To Crew" value={ship?.requiredCrew ?? ""} />
            <Metadata label="Capacity" value={ship?.capacity.cargo ?? ""} />
            <Metadata label="Max Fuel" value={ship?.capacity.fuels ?? ""} />
            <Metadata label="Payload" value={totalCargo ?? ""} />
            <Metadata label="Value" value={ship?.value ?? ""} />
        </div>
    )
}

function ShipPassengers({ ship }: { ship?: Ship }) {
    const [load, unload] = useLoadPassengers()

    const handleLoadPassengers = (event: MouseEvent) => {
        if (ship) {
            load(ship, getModifierAmount(event, ship.capacity.civilians))
        }
    }
    const handleUnloadPassengers = (event: MouseEvent) => {
        if (ship) {
            unload(ship, -getModifierAmount(event, ship.capacity.civilians))
        }
    }

    return (
        <div>
            <MetadataValue label="Passengers" value={ship?.passengers ?? 0} />
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Button onClick={handleLoadPassengers}>
                        <img src={yellowUp} />
                    </Button>
                    <Button onClick={handleUnloadPassengers}>
                        <img src={yellowDown} />
                    </Button>
                </div>
                <img src={civilians} />
            </div>
        </div>
    )
}

function ShipFuel({ ship }: { ship?: Ship }) {
    const [load, unload] = useLoadFuel()

    const handleLoadFuel = (event: MouseEvent) => {
        if (ship) {
            load(ship, getModifierAmount(event, ship.capacity.fuels))
        }
    }
    const handleUnloadFuel = (event: MouseEvent) => {
        if (ship) {
            unload(ship, -getModifierAmount(event, ship.capacity.fuels))
        }
    }

    return (
        <div>
            <MetadataValue label="Fuel" value={ship?.fuels ?? 0} />
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Button onClick={handleLoadFuel}>
                        <img src={yellowUp} />
                    </Button>
                    <Button onClick={handleUnloadFuel}>
                        <img src={yellowDown} />
                    </Button>
                </div>
                <img src={fuel} />
            </div>
        </div>
    )
}

export default function Cargo() {
    const planet =
        useSelectedColonizedPlanet() ??
        throwError("Cannot view Cargo of lifeless planet")
    const [selectedShipId, setSelectedShipId] = useState<string | undefined>(
        undefined,
    )
    const selectedShip = useAtomValue(shipsAtom).find(
        (s) => s.id === selectedShipId,
    )
    const crewShip = useCrewShip()
    const unloadShip = useUnloadShip()
    const decommissionShip = useDecommission()

    const handleSelectShip = (ship: Ship) => {
        setSelectedShipId(ship.id)
    }

    const handleCrewShip = () => {
        if (selectedShip) {
            crewShip(selectedShip)
        }
    }

    const handleUnloadShip = () => {
        if (selectedShip) {
            unloadShip(selectedShip)
        }
    }

    const handleDecommissionShip = () => {
        if (selectedShip) {
            decommissionShip(selectedShip)
        }
    }

    return (
        <div style={{ display: "flex" }}>
            <div>
                <div style={{ display: "flex" }}>
                    <div>
                        <DockingBay
                            planet={planet}
                            onClick={handleSelectShip}
                        />
                    </div>
                    <ShipCargoDetails planet={planet} ship={selectedShip} />
                </div>
                <div>{/* messages */}</div>
                <div style={{ display: "flex" }}>
                    <div>
                        <div style={{ display: "flex" }}>
                            <ShipIcon ship={selectedShip} />
                            <ShipPassengers ship={selectedShip} />
                            <ShipFuel ship={selectedShip} />
                        </div>
                        <div>
                            <Metadata
                                label="Class"
                                alignment="right"
                                value={selectedShip?.class ?? ""}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Button>
                            <img src={crew} onClick={handleCrewShip} />
                        </Button>
                        <Button>
                            <img src={unload} onClick={handleUnloadShip} />
                        </Button>
                        <Button>
                            <img
                                src={decommission}
                                onClick={handleDecommissionShip}
                            />
                        </Button>
                    </div>
                </div>
                <div>
                    <Navigation
                        items={[
                            "fleet",
                            "surface",
                            "overview",
                            "shipyard",
                            "training",
                        ]}
                    />
                </div>
            </div>
            <div style={{ display: "flex" }}>
                <CargoItem
                    cargo="food"
                    label="Food"
                    planet={planet}
                    ship={selectedShip}
                />
                <CargoItem
                    cargo="minerals"
                    label="Minerals"
                    planet={planet}
                    ship={selectedShip}
                />
                <CargoItem
                    cargo="fuels"
                    label="Fuels"
                    planet={planet}
                    ship={selectedShip}
                />
                <CargoItem
                    cargo="energy"
                    label="Energy"
                    planet={planet}
                    ship={selectedShip}
                />
            </div>
        </div>
    )
}
