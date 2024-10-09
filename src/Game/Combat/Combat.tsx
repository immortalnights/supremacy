import CombatAggression from "./components/CombatAggression"
import DockingBay from "../components/DockingBay"
import Navigation from "../components/Navigation"
import PlatoonGrid from "../components/PlatoonGrid"
import { Ship } from "../entities"
import combatVictory from "/images/combat_victory.gif"
import { useSelectedColonizedPlanet } from "../hooks"
import { throwError } from "game-signaling-server/client"

export default function Combat() {
    const planet =
        useSelectedColonizedPlanet() ??
        throwError("Cannot view Combat of lifeless planet")
    const ship: Ship | undefined = undefined

    return (
        <div style={{ display: "flex" }}>
            <div>
                <div style={{ display: "flex" }}>
                    <DockingBay planet={planet} onClick={() => {}} />
                    <div>
                        <div>Ship</div>
                        <div>{ship?.name}</div>
                        <PlatoonGrid
                            platoons={[]}
                            size={4}
                            onClick={() => {}}
                        />
                    </div>
                </div>
                <div>{/* messages */}</div>
                <div>
                    <PlatoonGrid platoons={[]} onClick={() => {}} />
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
                <CombatAggression
                    aggression={25}
                    onIncrease={() => {}}
                    onDecrease={() => {}}
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
