import DockingBay from "../../components/DockingBay"
import PlanetSurface from "../../components/PlanetSurface"
import surfaceBackground from "/images/surface_background.png"
import Navigation from "../../components/Navigation"

export default function Surface() {
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
                    <DockingBay
                        planet={{ id: 1, name: "Homebase!" }}
                        ships={[]}
                    />
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
