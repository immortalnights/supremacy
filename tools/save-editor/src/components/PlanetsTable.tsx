import type { Planet, ColonizedPlanet, LifelessPlanet, PlanetType } from "../../../../src/Supremacy/entities"
import type { Player } from "../../../../src/Supremacy/types"
import { useState } from "react"

interface PlanetsTableProps {
    planets: Planet[]
    players: Player[]
    onUpdate: (planets: Planet[]) => void
}

export default function PlanetsTable({ planets, players, onUpdate }: PlanetsTableProps) {
    const getPlayerName = (playerId: string | undefined) => {
        if (!playerId) return "None"
        const player = players.find((p) => p.id === playerId)
        return player ? player.name : playerId
    }

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editData, setEditData] = useState<Partial<Omit<ColonizedPlanet, "type"> & { type: PlanetType }>>({})

    const handleEdit = (planet: Planet) => {
        // If we're already editing a different planet, apply those changes first
        if (editingId && editingId !== planet.id) {
            handleApply()
        }

        setEditingId(planet.id)
        if (planet.type !== "lifeless") {
            setEditData({ ...planet })
        } else {
            // Initialize lifeless planet for colonization with its terraformedType
            setEditData({
                type: planet.terraformedType,
                owner: players[0]?.id || "",
                capital: false,
                credits: 0,
                population: 0,
                morale: 50,
                growth: 1,
                tax: 10,
                aggression: {},
                food: 0,
                minerals: 0,
                fuels: 0,
                energy: 0,
            })
        }
    }

    const handleApply = () => {
        if (!editingId) return
        const updated = planets.map((p) => {
            if (p.id === editingId) {
                if (editData.type === "lifeless") {
                    // Converting to or keeping as lifeless - preserve terraformedType
                    const terraformedType = p.type === "lifeless" ? p.terraformedType : p.type
                    const basePlanet: LifelessPlanet = {
                        id: p.id,
                        gridIndex: p.gridIndex,
                        name: editData.name || p.name,
                        type: "lifeless",
                        terraformedType: terraformedType,
                        terraformDuration: p.type === "lifeless" ? p.terraformDuration : 100,
                    }
                    return basePlanet
                } else {
                    // Converting to or keeping as colonized - preserve terraformedType in a comment
                    // Note: ColonizedPlanet doesn't have terraformedType, but we track it by the planet type
                    const { terraformedType, terraformDuration, ...baseData } = p as any
                    return {
                        ...baseData,
                        ...editData,
                        owner: editData.owner || players[0]?.id || "",
                        aggression: editData.aggression || {},
                    } as ColonizedPlanet
                }
            }
            return p
        })
        onUpdate(updated)
        setEditingId(null)
        setEditData({})
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditData({})
    }

    const handleDelete = (planet: Planet) => {
        // Can't delete capital planets
        if (planet.gridIndex === 0 || planet.gridIndex === planets.length - 1) {
            return
        }

        // Convert colonized planet back to lifeless
        if (planet.type !== "lifeless") {
            const updated = planets.map((p) => {
                if (p.id === planet.id) {
                    const terraformedType = p.type
                    const basePlanet: LifelessPlanet = {
                        id: p.id,
                        gridIndex: p.gridIndex,
                        name: p.name,
                        type: "lifeless",
                        terraformedType: terraformedType as Exclude<PlanetType, "lifeless">,
                        terraformDuration: 100,
                    }
                    return basePlanet
                }
                return p
            })
            onUpdate(updated)
        }
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Name</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Type</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Owner</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Population</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Credits</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Morale</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Tax</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Minerals</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Food</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Fuels</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Energy</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {planets.map((planet) => {
                        const isEditing = editingId === planet.id
                        const currentType = isEditing ? editData.type || planet.type : planet.type
                        const showOwner = currentType !== "lifeless"
                        const showData = currentType !== "lifeless"

                        return (
                            <tr key={planet.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                                <td style={{ padding: "0.75rem" }}>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.name || planet.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            style={{ width: "150px" }}
                                        />
                                    ) : (
                                        planet.name
                                    )}
                                </td>

                                {!showData && !isEditing ? (
                                    // Lifeless planet - colspan the type cell
                                    <td colSpan={10} style={{ padding: "0.75rem", textAlign: "center" }}>
                                        <span>
                                            lifeless
                                            {planet.type === "lifeless" && (
                                                <span
                                                    style={{
                                                        fontSize: "0.9em",
                                                        color: "#6c757d",
                                                        marginLeft: "0.25rem",
                                                    }}
                                                >
                                                    → {planet.terraformedType}
                                                </span>
                                            )}
                                        </span>
                                    </td>
                                ) : (
                                    <>
                                        <td style={{ padding: "0.75rem" }}>
                                            {isEditing ? (
                                                planet.type === "lifeless" ? (
                                                    <span>{planet.terraformedType}</span>
                                                ) : (
                                                    planet.type
                                                )
                                            ) : planet.type === "lifeless" ? (
                                                <span>
                                                    {planet.type}
                                                    <span style={{ fontSize: "0.8em", color: "#6c757d" }}>
                                                        {" "}
                                                        → {planet.terraformedType}
                                                    </span>
                                                </span>
                                            ) : (
                                                planet.type
                                            )}
                                        </td>
                                        <td style={{ padding: "0.75rem" }}>
                                            {isEditing && showOwner ? (
                                                <select
                                                    value={
                                                        editData.owner ||
                                                        (planet.type !== "lifeless" ? planet.owner : "")
                                                    }
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, owner: e.target.value })
                                                    }
                                                    style={{ width: "120px" }}
                                                    disabled={
                                                        planet.gridIndex === 0 ||
                                                        planet.gridIndex === planets.length - 1
                                                    }
                                                >
                                                    {players.map((player) => (
                                                        <option key={player.id} value={player.id}>
                                                            {player.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : showOwner ? (
                                                getPlayerName(planet.type !== "lifeless" ? planet.owner : undefined)
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                            {isEditing && showData ? (
                                                <input
                                                    type="number"
                                                    value={
                                                        editData.population ??
                                                        (planet.type !== "lifeless" ? planet.population : 0)
                                                    }
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, population: Number(e.target.value) })
                                                    }
                                                    style={{ width: "70px", textAlign: "right" }}
                                                />
                                            ) : showData ? (
                                                (planet as ColonizedPlanet).population?.toLocaleString()
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                            {isEditing && showData ? (
                                                <input
                                                    type="number"
                                                    value={
                                                        editData.credits ??
                                                        (planet.type !== "lifeless" ? planet.credits : 0)
                                                    }
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, credits: Number(e.target.value) })
                                                    }
                                                    style={{ width: "70px", textAlign: "right" }}
                                                />
                                            ) : showData ? (
                                                (planet as ColonizedPlanet).credits?.toLocaleString()
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                            {showData ? (planet as ColonizedPlanet).morale : "N/A"}
                                        </td>
                                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                            {isEditing && showData ? (
                                                <input
                                                    type="number"
                                                    value={
                                                        editData.tax ?? (planet.type !== "lifeless" ? planet.tax : 10)
                                                    }
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, tax: Number(e.target.value) })
                                                    }
                                                    style={{ width: "60px", textAlign: "right" }}
                                                    min="0"
                                                    max="100"
                                                />
                                            ) : showData ? (
                                                `${(planet as ColonizedPlanet).tax}%`
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                            {isEditing && showData ? (
                                                <input
                                                    type="number"
                                                    value={
                                                        editData.minerals ??
                                                        (planet.type !== "lifeless"
                                                            ? (planet as ColonizedPlanet).minerals
                                                            : 0)
                                                    }
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, minerals: Number(e.target.value) })
                                                    }
                                                    style={{ width: "70px", textAlign: "right" }}
                                                />
                                            ) : showData ? (
                                                (planet as ColonizedPlanet).minerals?.toLocaleString()
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                            {isEditing && showData ? (
                                                <input
                                                    type="number"
                                                    value={
                                                        editData.food ??
                                                        (planet.type !== "lifeless"
                                                            ? (planet as ColonizedPlanet).food
                                                            : 0)
                                                    }
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, food: Number(e.target.value) })
                                                    }
                                                    style={{ width: "70px", textAlign: "right" }}
                                                />
                                            ) : showData ? (
                                                (planet as ColonizedPlanet).food?.toLocaleString()
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                            {isEditing && showData ? (
                                                <input
                                                    type="number"
                                                    value={
                                                        editData.fuels ??
                                                        (planet.type !== "lifeless"
                                                            ? (planet as ColonizedPlanet).fuels
                                                            : 0)
                                                    }
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, fuels: Number(e.target.value) })
                                                    }
                                                    style={{ width: "70px", textAlign: "right" }}
                                                />
                                            ) : showData ? (
                                                (planet as ColonizedPlanet).fuels?.toLocaleString()
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                            {isEditing && showData ? (
                                                <input
                                                    type="number"
                                                    value={
                                                        editData.energy ??
                                                        (planet.type !== "lifeless"
                                                            ? (planet as ColonizedPlanet).energy
                                                            : 0)
                                                    }
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, energy: Number(e.target.value) })
                                                    }
                                                    style={{ width: "70px", textAlign: "right" }}
                                                />
                                            ) : showData ? (
                                                (planet as ColonizedPlanet).energy?.toLocaleString()
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                    </>
                                )}

                                <td style={{ padding: "0.75rem" }}>
                                    {isEditing ? (
                                        <div style={{ display: "flex", gap: "0.25rem" }}>
                                            <button
                                                onClick={handleApply}
                                                style={{
                                                    padding: "0.25rem 0.5rem",
                                                    fontSize: "0.8rem",
                                                    cursor: "pointer",
                                                    border: "1px solid #28a745",
                                                    backgroundColor: "#28a745",
                                                    color: "white",
                                                    borderRadius: "3px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                title="Apply"
                                            >
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                style={{
                                                    padding: "0.25rem 0.5rem",
                                                    fontSize: "0.8rem",
                                                    cursor: "pointer",
                                                    border: "1px solid #dc3545",
                                                    backgroundColor: "#dc3545",
                                                    color: "white",
                                                    borderRadius: "3px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                title="Cancel"
                                            >
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", gap: "0.25rem" }}>
                                            <button
                                                onClick={() => handleEdit(planet)}
                                                style={{
                                                    padding: "0.25rem 0.5rem",
                                                    fontSize: "0.8rem",
                                                    cursor: "pointer",
                                                    border: "1px solid #007bff",
                                                    backgroundColor: "white",
                                                    color: "#007bff",
                                                    borderRadius: "3px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                title={planet.type === "lifeless" ? "Colonize" : "Edit"}
                                            >
                                                {planet.type === "lifeless" ? (
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M12 2v20M2 12h20"></path>
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                )}
                                            </button>
                                            {planet.type !== "lifeless" &&
                                                planet.gridIndex !== 0 &&
                                                planet.gridIndex !== planets.length - 1 && (
                                                    <button
                                                        onClick={() => handleDelete(planet)}
                                                        style={{
                                                            padding: "0.25rem 0.5rem",
                                                            fontSize: "0.8rem",
                                                            cursor: "pointer",
                                                            border: "1px solid #dc3545",
                                                            backgroundColor: "white",
                                                            color: "#dc3545",
                                                            borderRadius: "3px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                        title="Delete (convert to lifeless)"
                                                    >
                                                        <svg
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        >
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                    </button>
                                                )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
