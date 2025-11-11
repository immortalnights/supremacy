import type { GameState } from "../../../src/Supremacy/types"
import { useState } from "react"
import WelcomeScreen from "./components/WelcomeScreen"
import EditorScreen from "./components/EditorScreen"
import CreateNewGame from "./components/CreateNewGame"

function App() {
    const [saveData, setSaveData] = useState<GameState | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [showCreateNew, setShowCreateNew] = useState(false)

    const handleCreateNew = (newGameState: GameState) => {
        setSaveData(newGameState)
        setShowCreateNew(false)
        setError(null)
    }

    if (showCreateNew) {
        return <CreateNewGame onCreate={handleCreateNew} onCancel={() => setShowCreateNew(false)} />
    }

    if (!saveData) {
        return (
            <WelcomeScreen
                onCreateNew={() => {
                    setShowCreateNew(true)
                    setError(null)
                }}
                onFileLoad={(data) => {
                    setSaveData(data)
                    setError(null)
                }}
                onError={setError}
                error={error}
            />
        )
    }

    return (
        <>
            <EditorScreen saveData={saveData} onUpdate={setSaveData} onClose={() => setSaveData(null)} />
            {error && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "1rem",
                        right: "1rem",
                        backgroundColor: "#fee",
                        border: "1px solid #fcc",
                        borderRadius: "4px",
                        padding: "0.75rem",
                        color: "#c33",
                        fontSize: "0.9rem",
                        maxWidth: "400px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        zIndex: 1000,
                    }}
                >
                    <strong>Error:</strong> {error}
                    <button
                        onClick={() => setError(null)}
                        style={{
                            marginLeft: "1rem",
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                        }}
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </>
    )
}

export default App
