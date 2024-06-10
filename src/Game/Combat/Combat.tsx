import Button from "../../components/Button"
import CombatAggression from "../../components/CombatAggression"
import DockingBay from "../../components/DockingBay"
import Navigation from "../../components/Navigation"
import PlatoonGrid from "../../components/PlatoonGrid"
import { Platoon, Ship } from "../entities"
import combatVictory from "/images/combat_victory.gif"

export default function Combat() {
    const ship: Ship | undefined = undefined

    return (
        <div style={{ display: "flex" }}>
            <div>
                <div style={{ display: "flex" }}>
                    <DockingBay planet={{ name: "Starbase!" }} ships={[]} />
                    <div>
                        <div>Ship</div>
                        <div>{ship?.name}</div>
                        <PlatoonGrid platoons={[]} size={4} />
                    </div>
                </div>
                <div>{/* messages */}</div>
                <div>
                    <PlatoonGrid platoons={[]} />
                </div>
            </div>
            <div></div>
            <div
                style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={combatVictory} />
                </div>
                <div style={{ padding: "0 10px", flex: "1 0 auto" }}>
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
                <CombatAggression aggression={25} />
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
