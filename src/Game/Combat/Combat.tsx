import CombatAggression from "./components/CombatAggression"
import DockingBay from "../components/DockingBay"
import Navigation from "../components/Navigation"
import PlatoonGrid from "../components/PlatoonGrid"
import { ColonizedPlanet, Ship } from "../entities"
import combatVictory from "/images/combat_victory.gif"
import { useSelectedColonizedPlanet } from "../hooks"
import { throwError } from "game-signaling-server/client"
import { useModifyAggression } from "./actions"
import { atom, useAtomValue } from "jotai"
import { platoonsAtom, sessionAtom } from "Game/store"
import { clamp } from "Game/utilities"

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

const platoonsOnPlanetAtom = atom((get) => ({
    filter: (planet?: ColonizedPlanet) =>
        get(platoonsAtom).filter(
            (platoon) =>
                platoon.state === "equipped" &&
                platoon.location.planet &&
                platoon.location.planet === planet?.id,
        ),
}))

const platoonsOnShipAtom = atom((get) => ({
    filter: (ship?: Ship) =>
        get(platoonsAtom).filter(
            (platoon) =>
                platoon.state === "equipped" &&
                platoon.location.ship &&
                platoon.location.ship === ship?.id,
        ),
}))

export default function Combat() {
    const { localPlayer } = useAtomValue(sessionAtom)
    const planet =
        useSelectedColonizedPlanet() ??
        throwError("Cannot view Combat of lifeless planet")
    const ship: Ship | undefined = undefined
    const aggression = planet.aggression[localPlayer] ?? 25
    const modifyAggression = useModifyAggression()

    const platoonsOnPlanet = useAtomValue(platoonsOnPlanetAtom).filter(planet)
    const platoonsOnShip = useAtomValue(platoonsOnShipAtom).filter(ship)

    const handleIncreaseAggression = () => {
        modifyAggression(planet, clamp(aggression + 25, 0, 100))
    }
    const handleDecreaseAggression = () => {
        modifyAggression(planet, clamp(aggression - 25, 0, 100))
    }

    return (
        <div style={{ display: "flex" }}>
            <div>
                <div style={{ display: "flex" }}>
                    <DockingBay planet={planet} onClick={() => {}} />
                    <div>
                        <div>Ship</div>
                        <div>{ship?.name}</div>
                        <PlatoonGrid
                            platoons={platoonsOnShip}
                            size={4}
                            onClick={() => {}}
                        />
                    </div>
                </div>
                <div>{/* messages */}</div>
                <div>
                    <PlatoonGrid
                        platoons={platoonsOnPlanet}
                        onClick={() => {}}
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
                    items={[
                        "training",
                        "fleet",
                        "overview",
                        "cargo",
                        "surface",
                    ]}
                />
            </div>
        </div>
    )
}
