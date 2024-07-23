import DockingBay from "../../components/DockingBay"
import PlanetSurface from "../../components/PlanetSurface"
import surfaceBackground from "/images/surface_background.png"
import Navigation from "../../components/Navigation"
import { useAtomValue } from "jotai"
import { selectedPlanetAtom } from "../store"
import { ColonizedPlanet } from "../entities"

export default function Surface() {
    const planet = useAtomValue(selectedPlanetAtom) as ColonizedPlanet

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
                    <DockingBay planet={planet} />
                    <PlanetSurface ships={[]} />
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
