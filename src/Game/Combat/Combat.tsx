import CombatAggression from "./components/CombatAggression"
import DockingBay from "../components/DockingBay"
import Navigation from "../components/Navigation"
import PlatoonGrid from "../components/PlatoonGrid"
import { Platoon, Ship } from "../entities"
import combatVictory from "/images/combat_victory.gif"
import { useSelectedColonizedPlanet, useSelectedShip } from "../hooks"
import { throwError } from "game-signaling-server/client"
import { useModifyAggression, useTransferPlatoon } from "./actions"
import { useAtomValue } from "jotai"
import { sessionAtom, shipsAtom } from "Game/store"
import { clamp } from "Game/utilities"
import { platoonsOnPlanetAtom, platoonsOnShipAtom } from "Game/utilities/platoons"
import { useEffect, useState } from "react"
import { isDocketAtPlanet } from "Game/utilities/ships"
import Screen from "Game/components/Screen"

const StrengthOverview = () => {
    return (
        <div style={{ width: "100%" }}>
            <div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <span>Your total strength:</span> <span>0</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <span>Enemy total strength:</span> <span>0</span>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <span>Total troops left:</span> <span>0</span>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <span>Scaling Factor:</span> <span>0%</span>
            </div>
        </div>
    )
}

export default function Combat() {
    const { localPlayer } = useAtomValue(sessionAtom)
    const planet =
        useSelectedColonizedPlanet() ??
        throwError("Cannot view Combat of lifeless planet")
    const [selectedShipId, setSelectedShipId] = useState<string | undefined>(undefined)
    const ships = useAtomValue(shipsAtom)
    const selectedShip = ships.find((s) => s.id === selectedShipId)
    const aggression = planet.aggression[localPlayer] ?? 25
    const modifyAggression = useModifyAggression()
    const [load, unload] = useTransferPlatoon()

    const platoonsOnPlanet = useAtomValue(platoonsOnPlanetAtom).filter(planet)
    const platoonsOnShip = useAtomValue(platoonsOnShipAtom).filter(selectedShip)

    const handleSelectShip = (ship: Ship) => {
        if (ship.class === "B-29 Battle Cruiser") {
            setSelectedShipId(ship.id)
        } else {
            console.warn(`Ship ${ship.name} cannot carry troops`)
        }
    }

    const handleUnloadPlatoon = (platoon: Platoon) => {
        if (selectedShip) {
            unload(platoon, planet)
        }
    }

    // Load the platoon
    const handleLoadPlatoon = (platoon: Platoon) => {
        if (selectedShip) {
            load(platoon, selectedShip)
        }
    }

    const handleIncreaseAggression = () => {
        modifyAggression(planet, clamp(aggression + 25, 0, 100))
    }

    const handleDecreaseAggression = () => {
        modifyAggression(planet, clamp(aggression - 25, 0, 100))
    }

    // auto-select first docked ship
    useEffect(() => {
        if (!selectedShip) {
            setSelectedShipId(
                ships.filter(
                    (ship) =>
                        isDocketAtPlanet(ship, planet) && ship.owner === localPlayer,
                )?.[0]?.id,
            )
        }
    }, [selectedShip, ships, planet])

    return (
        <Screen>
            <div>
                <div style={{ display: "flex" }}>
                    <DockingBay planet={planet} onClick={handleSelectShip} />
                    <div>
                        <div>Ship</div>
                        <div>{selectedShip?.name}</div>
                        <PlatoonGrid
                            platoons={platoonsOnShip}
                            size={4}
                            onClick={handleUnloadPlatoon}
                        />
                    </div>
                </div>
                <div>{/* messages */}</div>
                <div>
                    <PlatoonGrid
                        platoons={platoonsOnPlanet}
                        onClick={handleLoadPlatoon}
                    />
                </div>
            </div>
            <div></div>
            <div
                style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={combatVictory} />
                </div>
                <StrengthOverview />
                <CombatAggression
                    aggression={aggression}
                    onIncrease={handleIncreaseAggression}
                    onDecrease={handleDecreaseAggression}
                />
                <Navigation
                    items={["training", "fleet", "overview", "cargo", "surface"]}
                />
            </div>
        </Screen>
    )
}
