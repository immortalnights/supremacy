import type { GameState } from "../../../src/Supremacy/types"
import type { Planet, Ship, Platoon } from "../../../src/Supremacy/entities"
import { useState } from "react"
import PlanetsTable from "./components/PlanetsTable"
import ShipsTable from "./components/ShipsTable"
import PlatoonsTable from "./components/PlatoonsTable"
import CreateNewGame from "./components/CreateNewGame"

function App() {
    const [saveData, setSaveData] = useState<GameState | null>(null)
    const [jsonInput, setJsonInput] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"planets" | "ships" | "platoons">("planets")
    const [showCreateNew, setShowCreateNew] = useState(false)

    const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string) as GameState
                setSaveData(data)
                setJsonInput(JSON.stringify(data, null, 2))
                setError(null)
            } catch (error) {
                setError("Failed to parse save file: " + (error as Error).message)
            }
        }
        reader.readAsText(file)
    }

    const handleJsonPaste = () => {
        try {
            const data = JSON.parse(jsonInput) as GameState
            setSaveData(data)
            setError(null)
        } catch (error) {
            setError("Invalid JSON: " + (error as Error).message)
        }
    }

    const handleSave = () => {
        if (!saveData) return

        const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "supremacy-save.json"
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleCopyToClipboard = () => {
        if (!saveData) return
        navigator.clipboard.writeText(JSON.stringify(saveData, null, 2))
    }

    const handleCreateNew = (newGameState: GameState) => {
        setSaveData(newGameState)
        setJsonInput(JSON.stringify(newGameState, null, 2))
        setShowCreateNew(false)
    }

    if (showCreateNew) {
        return <CreateNewGame onCreate={handleCreateNew} onCancel={() => setShowCreateNew(false)} />
    }

    if (!saveData) {
        return (
            <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
                <h1>Supremacy Save Game Editor</h1>

                <div style={{ marginBottom: "2rem" }}>
                    <h2>Import Save Data</h2>

                    <div style={{ marginBottom: "1rem" }}>
                        <button
                            onClick={() => setShowCreateNew(true)}
                            style={{
                                padding: "0.75rem 1.5rem",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "1rem",
                                marginBottom: "1rem",
                            }}
                        >
                            Create New Game
                        </button>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>
                            <strong>Option 1: Upload File</strong>
                        </label>
                        <input type="file" accept=".json" onChange={handleFileLoad} />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>
                            <strong>Option 2: Paste JSON</strong>
                        </label>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder="Paste your save game JSON here..."
                            style={{
                                width: "100%",
                                minHeight: "200px",
                                fontFamily: "monospace",
                                padding: "0.5rem",
                            }}
                        />
                        <button onClick={handleJsonPaste} style={{ marginTop: "0.5rem" }}>
                            Load from JSON
                        </button>
                    </div>

                    {error && <div style={{ color: "red", marginTop: "1rem" }}>Error: {error}</div>}
                </div>
            </div>
        )
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
            <h1>Supremacy Save Game Editor</h1>

            <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
                <button onClick={handleSave}>Download as File</button>
                <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
                <button onClick={() => setSaveData(null)}>Load Different Save</button>
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
                        fontWeight: activeTab === "planets" ? "bold" : "normal",
                        backgroundColor: activeTab === "planets" ? "#007bff" : "#e9ecef",
                        color: activeTab === "planets" ? "white" : "black",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Planets ({saveData.planets.length})
                </button>
                <button
                    onClick={() => setActiveTab("ships")}
                    style={{
                        padding: "0.5rem 1rem",
                        marginRight: "0.5rem",
                        fontWeight: activeTab === "ships" ? "bold" : "normal",
                        backgroundColor: activeTab === "ships" ? "#007bff" : "#e9ecef",
                        color: activeTab === "ships" ? "white" : "black",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Ships ({saveData.ships.length})
                </button>
                <button
                    onClick={() => setActiveTab("platoons")}
                    style={{
                        padding: "0.5rem 1rem",
                        fontWeight: activeTab === "platoons" ? "bold" : "normal",
                        backgroundColor: activeTab === "platoons" ? "#007bff" : "#e9ecef",
                        color: activeTab === "platoons" ? "white" : "black",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Platoons ({saveData.platoons.length})
                </button>
            </div>

            {activeTab === "planets" && (
                <PlanetsTable
                    planets={saveData.planets}
                    players={saveData.players}
                    onUpdate={(planets: Planet[]) => setSaveData({ ...saveData, planets })}
                />
            )}
            {activeTab === "ships" && (
                <ShipsTable
                    ships={saveData.ships}
                    players={saveData.players}
                    onUpdate={(ships: Ship[]) => setSaveData({ ...saveData, ships })}
                />
            )}
            {activeTab === "platoons" && (
                <PlatoonsTable
                    platoons={saveData.platoons}
                    players={saveData.players}
                    onUpdate={(platoons: Platoon[]) => setSaveData({ ...saveData, platoons })}
                />
            )}
        </div>
    )
}

export default App
