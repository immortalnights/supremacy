import MiniMap from "./components/SolarSystem"
import { useAtom, useAtomValue } from "jotai"
import {
    planetsAtom,
    platoonsAtom,
    shipsAtom,
    selectedPlanetAtom,
    sessionAtom,
} from "../store"
import Navigation, { NavigationItem } from "../components/Navigation"
import Button from "components/Button"
import Date from "../components/Date"
import PlanetInfoGraphic from "../components/PlanetInfoGraphic"
import pauseIcon from "/images/pause.png"
import muteIcon from "/images/mute.png"
import systemUp from "/images/system_up.png"
import systemDown from "/images/system_down.png"
import systemScroll from "/images/system_scroll.png"
import { useAtomCallback } from "jotai/utils"
import { useCallback } from "react"
import { saveGame } from "../gameSetupUtilities"
import { Getter } from "jotai"
import { Atmos, Planet, Ship } from "Game/entities"
import { useMoveShip, useTransferShip } from "Game/actions"
import Screen from "Game/components/Screen"

const useSaveGame = () => {
    return useAtomCallback(
        useCallback((get: Getter) => {
            const session = get(sessionAtom)
            const planets = get(planetsAtom)
            const ships = get(shipsAtom)
            const platoons = get(platoonsAtom)

            saveGame(session, "paused", planets, ships, platoons)
        }, []),
    )
}

const useTerraformPlanet = () => {
    const { localPlayer } = useAtomValue(sessionAtom)
    const atmos = useAtomValue(shipsAtom).find(
        (ship) => ship.class === "Atmosphere Processor" && ship.owner === localPlayer,
    )
    const move = useMoveShip()
    const travel = useTransferShip()

    const atmosOnSurface = (ship: Ship): ship is Atmos =>
        ship.class === "Atmosphere Processor" && ship.position === "surface"

    return useCallback(
        (planet: Planet) => {
            if (!atmos) {
                console.warn(`Player does not own an Atmosphere Processor`)
            } else if (planet.type !== "lifeless") {
                console.warn(`Planet ${planet.name} has already been terraformed`)
            } else if (atmosOnSurface(atmos)) {
                console.warn(
                    `Formatting in progress, ${atmos.terraforming.remaining} days remaining, please wait`,
                )
            } else {
                move(atmos, "orbit")
                travel(atmos, planet)
            }
        },
        [atmos],
    )
}

export default function SolarSystem() {
    const planets = useAtomValue(planetsAtom)
    const { localPlayer } = useAtomValue(sessionAtom)
    const saveGame = useSaveGame()
    const [selectedPlanet, setSelectedPlanet] = useAtom(selectedPlanetAtom)
    const terraform = useTerraformPlanet()

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

    const handleActionClick = (item: NavigationItem) => {
        if (item === "atmos") {
            if (selectedPlanet) {
                terraform(selectedPlanet)
            }
        } else if (item === "spy") {
        } else if (item === "save") {
            saveGame()
        }
    }

    return (
        <Screen>
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
                    onAction={handleActionClick}
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
        </Screen>
    )
}
