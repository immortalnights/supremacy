import overviewIcon from "/images/overview.png"
import shipyardIcon from "/images/shipyard.png"
import fleetIcon from "/images/fleet.png"
import MiniMap from "../../components/SolarSystem"
import { useAtomValue } from "jotai"
import { planetsAtom } from "../store"

export default function SolarSystem() {
    const planets = useAtomValue(planetsAtom)

    return (
        <div>
            SolarSystem
            <div style={{ width: 280, height: 260 }}>
                <MiniMap planets={planets.length} />
            </div>
            <div>
                <a href="/Game/Overview">
                    <img src={overviewIcon} />
                </a>
                <a href="/Game/Shipyard">
                    <img src={shipyardIcon} />
                </a>
                <a href="/Game/Fleet">
                    <img src={fleetIcon} />
                </a>
            </div>
        </div>
    )
}
