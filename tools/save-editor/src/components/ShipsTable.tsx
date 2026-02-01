import type { Ship } from "../../../../src/Supremacy/entities"
import type { Player } from "../../../../src/Supremacy/types"
import { useState } from "react"

interface ShipsTableProps {
    ships: Ship[]
    players: Player[]
    onUpdate: (ships: Ship[]) => void
}

export default function ShipsTable({ ships, players, onUpdate }: ShipsTableProps) {
    const getPlayerName = (playerId: string | undefined) => {
        if (!playerId) return "None"
        const player = players.find((p) => p.id === playerId)
        return player ? player.name : playerId
    }
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editData, setEditData] = useState<Partial<Ship>>({})
    const [showAddForm, setShowAddForm] = useState(false)

    const handleEdit = (ship: Ship) => {
        setEditingId(ship.id)
        setEditData({ ...ship })
    }

    const handleSave = () => {
        if (!editingId) return
        const updated = ships.map((s) => (s.id === editingId ? ({ ...s, ...editData } as Ship) : s))
        onUpdate(updated)
        setEditingId(null)
        setEditData({})
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditData({})
    }

    const handleDelete = (shipId: string) => {
        if (confirm("Are you sure you want to delete this ship?")) {
            onUpdate(ships.filter((s) => s.id !== shipId))
        }
    }

    const handleAdd = () => {
        const newShip: Ship = {
            id: crypto.randomUUID(),
            name: "New Ship",
            class: "B-29 Battle Cruiser",
            description: "",
            owner: "player1",
            requiredCrew: 100,
            crew: 100,
            fuels: 1000,
            passengers: 0,
            capacity: {
                civilians: 100,
                cargo: 1000,
                fuels: 1000,
                platoons: 4,
            },
            cargo: {
                food: 0,
                minerals: 0,
                fuels: 0,
                energy: 0,
            },
            value: 10000,
            position: "orbit",
            location: {
                planet: "planet-0",
            },
        } as Ship
        onUpdate([...ships, newShip])
        setShowAddForm(false)
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <div style={{ marginBottom: "1rem" }}>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    {showAddForm ? "Cancel" : "Add New Ship"}
                </button>
                {showAddForm && (
                    <button
                        onClick={handleAdd}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginLeft: "0.5rem",
                        }}
                    >
                        Confirm Add
                    </button>
                )}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Name</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Class</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Owner</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Position</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Location</th>
                        <th style={{ padding: "0.75rem", textAlign: "center" }}>Active</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Crew</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Fuel</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Passengers</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ships.map((ship) => {
                        const isEditing = editingId === ship.id
                        return (
                            <tr key={ship.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                                <td style={{ padding: "0.75rem" }}>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.name || ship.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            style={{ width: "150px" }}
                                        />
                                    ) : (
                                        ship.name
                                    )}
                                </td>
                                <td style={{ padding: "0.75rem" }}>{ship.class}</td>
                                <td style={{ padding: "0.75rem" }}>{getPlayerName(ship.owner)}</td>
                                <td style={{ padding: "0.75rem" }}>{ship.position}</td>
                                <td style={{ padding: "0.75rem" }}>
                                    {ship.position === "outer-space"
                                        ? "In Transit"
                                        : ship.position === "orbit"
                                          ? ship.location.planet
                                          : `${ship.location.planet} (${ship.location.index})`}
                                </td>
                                <td style={{ padding: "0.75rem", textAlign: "center" }}>
                                    {ship.position === "surface" && ship.active ? "✓" : "✗"}
                                </td>
                                <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editData.crew ?? ship.crew}
                                            onChange={(e) => setEditData({ ...editData, crew: Number(e.target.value) })}
                                            style={{ width: "80px", textAlign: "right" }}
                                        />
                                    ) : (
                                        ship.crew.toLocaleString()
                                    )}
                                </td>
                                <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                    {typeof ship.fuels === "number" ? ship.fuels.toLocaleString() : "Nuclear"}
                                </td>
                                <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editData.passengers ?? ship.passengers}
                                            onChange={(e) =>
                                                setEditData({ ...editData, passengers: Number(e.target.value) })
                                            }
                                            style={{ width: "80px", textAlign: "right" }}
                                        />
                                    ) : (
                                        ship.passengers.toLocaleString()
                                    )}
                                </td>
                                <td style={{ padding: "0.75rem" }}>
                                    {isEditing ? (
                                        <div style={{ display: "flex", gap: "0.25rem" }}>
                                            <button
                                                onClick={handleSave}
                                                style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", gap: "0.25rem" }}>
                                            <button
                                                onClick={() => handleEdit(ship)}
                                                style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ship.id)}
                                                style={{
                                                    padding: "0.25rem 0.5rem",
                                                    fontSize: "0.8rem",
                                                    backgroundColor: "#dc3545",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Delete
                                            </button>
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
