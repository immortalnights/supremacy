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
import { selectedPlanetAtom } from "../store"
import { ColonizedPlanet } from "../entities"
import FleetGrid from "../../components/FleetGrid"
import { useState } from "react"

export default function Fleet() {
    const planet = useAtomValue(selectedPlanetAtom) as ColonizedPlanet
    const [selectedShip, setSelectedShip] = useState<Ship | undefined>()

    const handleShipSelected = (ship: Ship) => {
        setSelectedShip(ship)
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                <DockingBay planet={planet} onClick={handleShipSelected} />
                <div>
                    <div>
                        <Button>
                            <img src={launchIcon} />
                        </Button>
                        <Button>
                            <img src={travelIcon} />
                        </Button>
                        <Button>
                            <img src={dockIcon} />
                        </Button>
                    </div>
                    <div>
                        <ShipDetails ship={selectedShip} />
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Button>
                        <img src={decommissionIcon} />
                    </Button>
                    <Button>
                        <img src={renameIcon} />
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
                <FleetGrid onClick={handleShipSelected} />
                <ShipHeading ship={selectedShip} />
                <Navigation
                    items={["surface", "overview", "training"]}
                    direction="column"
                />
            </div>
        </div>
    )
}
