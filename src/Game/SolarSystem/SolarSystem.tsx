import MiniMap from "./components/SolarSystem"
import { useAtomValue } from "jotai"
import { planetsAtom, sessionAtom } from "../store"
import Navigation from "../components/Navigation"
import Button from "components/Button"
import Date from "../components/Date"
import PlanetInfoGraph from "../components/PlanetInfoGraph"
import pauseIcon from "/images/pause.png"
import muteIcon from "/images/mute.png"
import systemUp from "/images/system_up.png"
import systemDown from "/images/system_down.png"
import systemScroll from "/images/system_scroll.png"

export default function SolarSystem() {
    const planets = useAtomValue(planetsAtom)
    const { localPlayer } = useAtomValue(sessionAtom)

    return (
        <div>
            <div style={{ display: "flex" }}>
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                    <div>
                        <MiniMap
                            selected={planets.length - 1}
                            planets={planets}
                            localPlayer={localPlayer}
                        />
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
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 5,
                            }}
                        >
                            <Button onClick={() => {}}>
                                <img src={systemUp} />
                            </Button>
                            <Button onClick={() => {}}>
                                <img src={systemDown} />
                            </Button>
                        </div>
                        <div>
                            <Button onClick={() => {}}>
                                <img src={systemScroll} />
                            </Button>
                        </div>
                        <div>
                            <Date />
                            <PlanetInfoGraph planet={{ name: "Starbase!" }} />
                        </div>
                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
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
