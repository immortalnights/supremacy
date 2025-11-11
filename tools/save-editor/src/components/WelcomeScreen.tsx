import type { GameState } from "../../../../src/Supremacy/types"
import { useRef } from "react"

interface WelcomeScreenProps {
    onCreateNew: () => void
    onFileLoad: (data: GameState) => void
    onError: (error: string) => void
    error: string | null
}

function WelcomeScreen({ onCreateNew, onFileLoad, onError, error }: WelcomeScreenProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const validateGameState = (data: any): data is GameState => {
        // Check if data is an object
        if (!data || typeof data !== "object") {
            onError("Invalid data: must be an object")
            return false
        }

        // Check required top-level properties
        if (!data.id || typeof data.id !== "string") {
            onError("Invalid data: missing or invalid 'id' property")
            return false
        }

        if (!data.name || typeof data.name !== "string") {
            onError("Invalid data: missing or invalid 'name' property")
            return false
        }

        if (!data.difficulty || !["Easy", "Normal", "Hard"].includes(data.difficulty)) {
            onError("Invalid data: missing or invalid 'difficulty' property (must be Easy, Normal, or Hard)")
            return false
        }

        // Check players array
        if (!Array.isArray(data.players) || data.players.length !== 2) {
            onError("Invalid data: must have exactly 2 players")
            return false
        }

        // Check planets array
        if (!Array.isArray(data.planets)) {
            onError("Invalid data: 'planets' must be an array")
            return false
        }

        // Validate planet count based on difficulty
        const expectedPlanetCount: Record<string, number> = {
            Easy: 8,
            Normal: 16,
            Hard: 32,
        }

        if (data.planets.length !== expectedPlanetCount[data.difficulty]) {
            onError(
                `Invalid data: ${data.difficulty} difficulty should have ${expectedPlanetCount[data.difficulty]} planets, found ${data.planets.length}`,
            )
            return false
        }

        return true
    }

    const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string)
                if (validateGameState(data)) {
                    onFileLoad(data as GameState)
                }
            } catch (error) {
                onError("Failed to parse save file: " + (error as Error).message)
            }
        }
        reader.readAsText(file)
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                backgroundColor: "#f5f7fa",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    width: "100%",
                    textAlign: "center",
                }}
            >
                <h1
                    style={{
                        fontSize: "2rem",
                        marginBottom: "0.5rem",
                        marginTop: 0,
                        color: "#2c3e50",
                    }}
                >
                    Supremacy Save Game Editor
                </h1>
                <p
                    style={{
                        fontSize: "1rem",
                        color: "#7f8c8d",
                        marginBottom: "2rem",
                        marginTop: 0,
                    }}
                >
                    Choose how you want to start
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "1.5rem",
                        marginBottom: "1rem",
                    }}
                >
                    {/* Create New Game Card */}
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            padding: "1.5rem",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                            cursor: "pointer",
                            border: "2px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)"
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"
                            e.currentTarget.style.borderColor = "#28a745"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
                            e.currentTarget.style.borderColor = "transparent"
                        }}
                        onClick={onCreateNew}
                    >
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "#28a745",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "1rem",
                            }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 2v20M2 12h20"></path>
                            </svg>
                        </div>
                        <h2
                            style={{
                                fontSize: "1.25rem",
                                marginBottom: "0.75rem",
                                marginTop: 0,
                                color: "#2c3e50",
                            }}
                        >
                            Create New Game
                        </h2>
                        <p
                            style={{
                                color: "#7f8c8d",
                                lineHeight: "1.5",
                                marginBottom: "1rem",
                                marginTop: 0,
                                fontSize: "0.9rem",
                            }}
                        >
                            Start fresh with a new game configuration. Choose difficulty, player names, and optional
                            seed.
                        </p>
                        <button
                            style={{
                                padding: "0.65rem 1.5rem",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                fontWeight: "bold",
                                marginTop: "auto",
                                pointerEvents: "none",
                            }}
                        >
                            Create
                        </button>
                    </div>

                    {/* Upload File Card */}
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            padding: "1.5rem",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                            cursor: "pointer",
                            border: "2px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)"
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"
                            e.currentTarget.style.borderColor = "#007bff"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
                            e.currentTarget.style.borderColor = "transparent"
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "#007bff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "1rem",
                            }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        <h2
                            style={{
                                fontSize: "1.25rem",
                                marginBottom: "0.75rem",
                                marginTop: 0,
                                color: "#2c3e50",
                            }}
                        >
                            Upload File
                        </h2>
                        <p
                            style={{
                                color: "#7f8c8d",
                                lineHeight: "1.5",
                                marginBottom: "1rem",
                                marginTop: 0,
                                fontSize: "0.9rem",
                            }}
                        >
                            Load an existing save game file from your computer to view and edit.
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                fileInputRef.current?.click()
                            }}
                            style={{
                                padding: "0.65rem 1.5rem",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                fontWeight: "bold",
                                marginTop: "auto",
                            }}
                        >
                            Choose File
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleFileLoad}
                            style={{ display: "none" }}
                        />
                    </div>

                    {/* Paste JSON Card */}
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            padding: "1.5rem",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                            cursor: "pointer",
                            border: "2px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)"
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"
                            e.currentTarget.style.borderColor = "#6f42c1"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
                            e.currentTarget.style.borderColor = "transparent"
                        }}
                        onClick={async () => {
                            try {
                                const text = await navigator.clipboard.readText()
                                if (text) {
                                    const data = JSON.parse(text)
                                    if (validateGameState(data)) {
                                        onFileLoad(data as GameState)
                                    }
                                }
                            } catch (error) {
                                onError("Failed to paste or parse JSON: " + (error as Error).message)
                            }
                        }}
                    >
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "#6f42c1",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "1rem",
                            }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                            </svg>
                        </div>
                        <h2
                            style={{
                                fontSize: "1.25rem",
                                marginBottom: "0.75rem",
                                marginTop: 0,
                                color: "#2c3e50",
                            }}
                        >
                            Paste JSON
                        </h2>
                        <p
                            style={{
                                color: "#7f8c8d",
                                lineHeight: "1.5",
                                marginBottom: "1rem",
                                marginTop: 0,
                                fontSize: "0.9rem",
                            }}
                        >
                            Paste save game JSON data directly from your clipboard to quickly load a game.
                        </p>
                        <button
                            style={{
                                padding: "0.65rem 1.5rem",
                                backgroundColor: "#6f42c1",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                fontWeight: "bold",
                                marginTop: "auto",
                                pointerEvents: "none",
                            }}
                        >
                            Paste & Load
                        </button>
                    </div>
                </div>

                {error && (
                    <div
                        style={{
                            backgroundColor: "#fee",
                            border: "1px solid #fcc",
                            borderRadius: "4px",
                            padding: "0.75rem",
                            color: "#c33",
                            marginTop: "1rem",
                            fontSize: "0.9rem",
                            width: "100%",
                        }}
                    >
                        <strong>Error:</strong> {error}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WelcomeScreen
