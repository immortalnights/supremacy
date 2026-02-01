import type { GameState } from "../../../../src/Supremacy/types"
import type { Planet, Ship, Platoon } from "../../../../src/Supremacy/entities"
import { useState } from "react"
import PlanetsTable from "./PlanetsTable"
import ShipsTable from "./ShipsTable"
import PlatoonsTable from "./PlatoonsTable"

interface EditorScreenProps {
    saveData: GameState
    onUpdate: (data: GameState) => void
    onClose: () => void
}

function EditorScreen({ saveData, onUpdate, onClose }: EditorScreenProps) {
    const [activeTab, setActiveTab] = useState<"planets" | "ships" | "platoons">("planets")

    const handleSave = () => {
        const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "supremacy-save.json"
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(saveData, null, 2))
    }

    const handlePlanetsUpdate = (planets: Planet[]) => {
        onUpdate({ ...saveData, planets })
    }

    const handleShipsUpdate = (ships: Ship[]) => {
        onUpdate({ ...saveData, ships })
    }

    const handlePlatoonsUpdate = (platoons: Platoon[]) => {
        onUpdate({ ...saveData, platoons })
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
            <h1>Supremacy Save Game Editor</h1>

            <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
                <button onClick={handleSave}>Download as File</button>
                <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
                <button onClick={onClose}>Load Different Save</button>
            </div>

            <div style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                <h2 style={{ marginTop: 0 }}>Game Info</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                    <div>
                        <strong>Difficulty:</strong> {saveData.difficulty}
                    </div>
                    <div>
                        <strong>Date:</strong> {saveData.date}
                    </div>
                    <div>
                        <strong>Speed:</strong> {saveData.speed}
                    </div>
                    <div>
                        <strong>Players:</strong> {saveData.players.length}
                    </div>
                    <div>
                        <strong>Planets:</strong> {saveData.planets.length}
                    </div>
                    <div>
                        <strong>Ships:</strong> {saveData.ships.length}
                    </div>
                    <div>
                        <strong>Platoons:</strong> {saveData.platoons.length}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <button
                    onClick={() => setActiveTab("planets")}
                    style={{
                        padding: "0.5rem 1rem",
                        marginRight: "0.5rem",
                        backgroundColor: activeTab === "planets" ? "#007bff" : "#e9ecef",
                        color: activeTab === "planets" ? "white" : "black",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Planets
                </button>
                <button
                    onClick={() => setActiveTab("ships")}
                    style={{
                        padding: "0.5rem 1rem",
                        marginRight: "0.5rem",
                        backgroundColor: activeTab === "ships" ? "#007bff" : "#e9ecef",
                        color: activeTab === "ships" ? "white" : "black",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Ships
                </button>
                <button
                    onClick={() => setActiveTab("platoons")}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: activeTab === "platoons" ? "#007bff" : "#e9ecef",
                        color: activeTab === "platoons" ? "white" : "black",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Platoons
                </button>
            </div>

            {activeTab === "planets" && (
                <PlanetsTable planets={saveData.planets} players={saveData.players} onUpdate={handlePlanetsUpdate} />
            )}
            {activeTab === "ships" && (
                <ShipsTable ships={saveData.ships} players={saveData.players} onUpdate={handleShipsUpdate} />
            )}
            {activeTab === "platoons" && (
                <PlatoonsTable
                    platoons={saveData.platoons}
                    players={saveData.players}
                    onUpdate={handlePlatoonsUpdate}
                />
            )}
        </div>
    )
}

export default EditorScreen
