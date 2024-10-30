import MiniMap from "./components/SolarSystem"
import { useAtom, useAtomValue } from "jotai"
import { planetsAtom, selectedPlanetAtom, sessionAtom } from "../store"
import Navigation from "../components/Navigation"
import Button from "components/Button"
import Date from "../components/Date"
import PlanetInfoGraphic from "../components/PlanetInfoGraphic"
import pauseIcon from "/images/pause.png"
import muteIcon from "/images/mute.png"
import systemUp from "/images/system_up.png"
import systemDown from "/images/system_down.png"
import systemScroll from "/images/system_scroll.png"

export default function SolarSystem() {
    const planets = useAtomValue(planetsAtom)
    const { localPlayer } = useAtomValue(sessionAtom)
    const [selectedPlanet, setSelectedPlanet] = useAtom(selectedPlanetAtom)

    const handlePreviousPlanet = () => {
        let index = planets.findIndex((planet) => planet.id === selectedPlanet?.id)
        index = (index - 1 + planets.length) % planets.length
        setSelectedPlanet(planets[index])
    }
    const handleNextPlanet = () => {
        let index = planets.findIndex((planet) => planet.id === selectedPlanet?.id)
        index = (index + 1) % planets.length
        setSelectedPlanet(planets[index])
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <MiniMap
                        selected={planets.length - 1}
                        planets={planets}
                        localPlayer={localPlayer}
                    />
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
                <div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 5,
                            }}
                        >
                            <Button onClick={handlePreviousPlanet}>
                                <img src={systemUp} />
                            </Button>
                            <Button onClick={handleNextPlanet}>
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
                            {selectedPlanet && (
                                <PlanetInfoGraphic planet={selectedPlanet} />
                            )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
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
