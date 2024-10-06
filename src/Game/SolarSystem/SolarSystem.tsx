import MiniMap from "./components/SolarSystem"
import { useAtomValue } from "jotai"
import { planetsAtom } from "../store"
import Navigation from "../components/Navigation"
import Button from "components/Button"
import Date from "../components/Date"
import PlanetInfoGraph from "../components/PlanetInfoGraph"
import pauseIcon from "/images/pause.png"
import muteIcon from "/images/mute.png"

export default function SolarSystem() {
    const planets = useAtomValue(planetsAtom)

    return (
        <div>
            <div style={{ display: "flex" }}>
                <div>
                    <div>
                        <MiniMap planets={planets.length} />
                    </div>
                    <div>
                        <Navigation
                            items={[
                                "overview",
                                "shipyard",
                                "fleet",
                                "atmos",
                                "training",
                                "cargo",
                                "surface",
                                "combat",
                                "spy",
                                "save",
                            ]}
                        />
                    </div>
                </div>
                <div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div>
                            <Button onClick={() => {}}>Up</Button>
                            <Button onClick={() => {}}>Down</Button>
                        </div>
                        <div>
                            <Date />
                            <PlanetInfoGraph planet={{ name: "Starbase!" }} />
                        </div>
                        <div style={{}}>
                            <Button onClick={() => {}}>
                                <img src={pauseIcon} />
                            </Button>
                            <Button onClick={() => {}}>
                                <img src={muteIcon} />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div
                            style={{
                                background: "black",
                                width: 288,
                                height: 208,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
