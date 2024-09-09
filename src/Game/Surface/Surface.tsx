import DockingBay from "../../components/DockingBay"
import PlanetSurface from "../../components/PlanetSurface"
import surfaceBackground from "/images/surface_background.png"
import Navigation from "../../components/Navigation"
import { useAtomValue } from "jotai"
import { selectedPlanetAtom } from "../store"
import { ColonizedPlanet, Ship } from "../entities"
import { useMoveShip, useEnableDisableShip } from "./commands"

export default function Surface() {
    const planet = useAtomValue(selectedPlanetAtom) as ColonizedPlanet
    const moveShipTo = useMoveShip()
    const toggleShip = useEnableDisableShip()

    const handleMoveToSurface = (ship: Ship) => {
        if (ship) {
            moveShipTo(ship, planet, "surface")
        }
    }

    const handleMoveToDockingBay = (ship: Ship) => {
        if (ship) {
            moveShipTo(ship, planet, "docked")
        }
    }

    const handleEnableShip = (ship: Ship) => {
        if (ship) {
            toggleShip(ship, true)
        }
    }

    const handleDisableShip = (ship: Ship) => {
        if (ship) {
            toggleShip(ship, false)
        }
    }

    return (
        <div>
            <div>
                <img src={surfaceBackground} />
            </div>
            <div style={{ padding: "2px 5px" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: "2px 0px",
                    }}
                >
                    <DockingBay planet={planet} onClick={handleMoveToSurface} />
                    <PlanetSurface
                        planet={planet}
                        onClick={handleMoveToDockingBay}
                        onEnable={handleEnableShip}
                        onDisable={handleDisableShip}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <div>{/* messages */}</div>
                    <Navigation
                        items={["shipyard", "overview", "fleet", "cargo"]}
                    />
                </div>
            </div>
        </div>
    )
}
