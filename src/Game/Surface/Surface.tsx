import DockingBay from "Game/components/DockingBay"
import PlanetSurface from "./components/PlanetSurface"
import surfaceBackground from "/images/surface_background.png"
import Navigation from "Game/components/Navigation"
import { Ship } from "Game/entities"
import { useMoveShip } from "Game/actions"
import { useSelectedColonizedPlanet } from "Game/hooks"
import { throwError } from "game-signaling-server/client"
import Screen from "Game/components/Screen"

export default function Surface() {
    const planet =
        useSelectedColonizedPlanet() ??
        throwError("Cannot view Surface of lifeless planet")
    const move = useMoveShip()

    const handleClickDockedShip = (ship: Ship) => {
        if (ship) {
            move(ship, "surface")
        }
    }

    return (
        <Screen flexDirection="column">
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
                    <DockingBay planet={planet} onClick={handleClickDockedShip} />
                    <PlanetSurface planet={planet} />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <div>{/* messages */}</div>
                    <Navigation items={["shipyard", "overview", "fleet", "cargo"]} />
                </div>
            </div>
        </Screen>
    )
}
