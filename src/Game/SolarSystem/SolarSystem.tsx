import overviewIcon from "/images/overview.png"
import shipyardIcon from "/images/shipyard.png"
import fleetIcon from "/images/fleet.png"
import MiniMap from "../../components/SolarSystem"
import { useAtomValue } from "jotai"
import { planetsAtom } from "../store"
import { Link } from "react-router-dom"

export default function SolarSystem() {
    const planets = useAtomValue(planetsAtom)

    return (
        <div>
            SolarSystem
            <div style={{ width: 280, height: 260 }}>
                <MiniMap planets={planets.length} />
            </div>
            <div>
                <Link to="Overview" relative="path">
                    <img src={overviewIcon} />
                </Link>
                <Link to="Shipyard" relative="path">
                    <img src={shipyardIcon} />
                </Link>
                <Link to="Fleet" relative="path">
                    <img src={fleetIcon} />
                </Link>
            </div>
        </div>
    )
}