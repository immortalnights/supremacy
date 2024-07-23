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
import { ColonizedPlanet, Ship } from "../entities"
import { useAtomValue } from "jotai"
import { selectedPlanetAtom } from "../store"

function CargoItem({
    label,
    inStore,
    inShip,
    onLoad,
    onUnload,
}: {
    label: string
    inStore: number
    inShip: number | undefined
    onLoad: () => void
    onUnload: () => void
}) {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={onUnload}>
                    <img src={unloadCargo} />
                </Button>
                <Button onClick={onLoad}>
                    <img src={loadCargo} />
                </Button>
            </div>
            <div style={{ textAlign: "center" }}>{label}</div>
            <div>
                <MetadataValue value={inStore} />
                <MetadataValue value={inShip ?? ""} />
            </div>
        </div>
    )
}

function ShipCargoDetails({ ship }: { ship?: Ship }) {
    const totalCargo = ship ? 0 : undefined
    return (
        <div>
            <Metadata label="Ship" value={ship?.name ?? ""} />
            <Metadata label="Civilians" value={ship?.passengers ?? ""} />
            <Metadata label="Seats" value={ship?.passengerLimit ?? ""} />
            <Metadata label="To Crew" value={ship?.requiredCrew ?? ""} />
            <Metadata label="Capacity" value={ship?.cargoCapacity ?? ""} />
            <Metadata label="Max Fuel" value={ship?.maxFuel ?? ""} />
            <Metadata label="Payload" value={totalCargo ?? ""} />
            <Metadata label="Value" value={ship?.value ?? ""} />
        </div>
    )
}

function ShipPassengers({
    ship,
    onLoad,
    onUnload,
}: {
    ship?: Ship
    onLoad: () => void
    onUnload: () => void
}) {
    return (
        <div>
            <MetadataValue label="Passengers" value={ship?.passengers ?? ""} />
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Button onClick={onLoad}>
                        <img src={yellowUp} />
                    </Button>
                    <Button onClick={onUnload}>
                        <img src={yellowDown} />
                    </Button>
                </div>
                <img src={civilians} />
            </div>
        </div>
    )
}

function ShipFuel({
    ship,
    onLoad,
    onUnload,
}: {
    ship?: Ship
    onLoad: () => void
    onUnload: () => void
}) {
    return (
        <div>
            <MetadataValue label="Fuel" value={ship?.passengers ?? ""} />
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Button onClick={onLoad}>
                        <img src={yellowUp} />
                    </Button>
                    <Button onClick={onUnload}>
                        <img src={yellowDown} />
                    </Button>
                </div>
                <img src={fuel} />
            </div>
        </div>
    )
}

export default function Cargo() {
    const planet = useAtomValue(selectedPlanetAtom) as ColonizedPlanet

    return (
        <div style={{ display: "flex" }}>
            <div>
                <div style={{ display: "flex" }}>
                    <div>
                        <DockingBay planet={planet} />
                    </div>
                    <ShipCargoDetails ship={undefined} />
                </div>
                <div>{/* messages */}</div>
                <div style={{ display: "flex" }}>
                    <div>
                        <div style={{ display: "flex" }}>
                            <ShipIcon ship={undefined} />
                            <ShipPassengers ship={undefined} />
                            <ShipFuel ship={undefined} />
                        </div>
                        <div>
                            <Metadata label="Class" alignment="right" />
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Button>
                            <img src={crew} />
                        </Button>
                        <Button>
                            <img src={unload} />
                        </Button>
                        <Button>
                            <img src={decommission} />
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
                <CargoItem label="Food" inStore={0} />
                <CargoItem label="Minerals" inStore={0} />
                <CargoItem label="Fuels" inStore={0} />
                <CargoItem label="Energy" inStore={0} />
            </div>
        </div>
    )
}
