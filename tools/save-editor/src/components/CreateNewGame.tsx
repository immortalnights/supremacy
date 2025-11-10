import { useState } from "react"
import type { GameState } from "../../../../src/Supremacy/types"
import { setup } from "../../../../src/Supremacy/setup2"

interface CreateNewGameProps {
    onCreate: (gameState: GameState) => void
    onCancel: () => void
}

export default function CreateNewGame({ onCreate, onCancel }: CreateNewGameProps) {
    const [difficulty, setDifficulty] = useState<"Easy" | "Normal" | "Hard">("Easy")
    const [playerName, setPlayerName] = useState("Player 1")
    const [opponentName, setOpponentName] = useState("Computer")
    const [seed, setSeed] = useState("")

    const handleCreate = () => {
        const gameState = setup(
            {
                name: "New Game",
                difficulty,
                seed: seed || undefined,
            },
            {
                id: crypto.randomUUID(),
                name: opponentName,
                host: false,
                eliminated: false,
                bot: true,
                difficulty: difficulty === "Easy" ? "Easy" : difficulty === "Hard" ? "Hard" : "Normal",
                shipOrders: {},
                espionageReports: {},
            },
            {
                id: crypto.randomUUID(),
                name: playerName,
                host: true,
                eliminated: false,
                bot: false,
            },
        )
        onCreate(gameState)
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
            <h1>Create New Game</h1>

            <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Difficulty</label>
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        fontSize: "1rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                >
                    <option value="Easy">Easy</option>
                    <option value="Normal">Normal</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Player Name</label>
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        fontSize: "1rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
            </div>

            <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Opponent Name</label>
                <input
                    type="text"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        fontSize: "1rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
            </div>

            <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Seed (optional)</label>
                <input
                    type="text"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Leave empty for random seed"
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        fontSize: "1rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
                <small style={{ color: "#6c757d" }}>Same seed produces the same planet types</small>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
                <button
                    onClick={handleCreate}
                    style={{
                        flex: 1,
                        padding: "0.75rem",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "1rem",
                    }}
                >
                    Create Game
                </button>
                <button
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        padding: "0.75rem",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "1rem",
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}
