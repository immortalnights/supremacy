import type { Platoon } from "../../../../src/Supremacy/entities"
import type { Player } from "../../../../src/Supremacy/types"

interface PlatoonsTableProps {
    platoons: Platoon[]
    players: Player[]
    onUpdate?: (platoons: Platoon[]) => void
}

export default function PlatoonsTable({ platoons, players }: PlatoonsTableProps) {
    const getPlayerName = (playerId: string | undefined) => {
        if (!playerId) return "None"
        const player = players.find((p) => p.id === playerId)
        return player ? player.name : playerId
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>ID</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Owner</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>State</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Location</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Size</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Calibre</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Suit</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Weapon</th>
                    </tr>
                </thead>
                <tbody>
                    {platoons.map((platoon) => (
                        <tr key={platoon.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                            <td style={{ padding: "0.75rem" }}>{platoon.id}</td>
                            <td style={{ padding: "0.75rem" }}>{getPlayerName(platoon.owner)}</td>
                            <td style={{ padding: "0.75rem" }}>{platoon.state}</td>
                            <td style={{ padding: "0.75rem" }}>
                                {platoon.state === "equipped"
                                    ? platoon.location.ship
                                        ? `Ship: ${platoon.location.ship}`
                                        : `Planet: ${platoon.location.planet}`
                                    : "N/A"}
                            </td>
                            <td style={{ padding: "0.75rem", textAlign: "right" }}>{platoon.size.toLocaleString()}</td>
                            <td style={{ padding: "0.75rem", textAlign: "right" }}>
                                {platoon.calibre.toLocaleString()}
                            </td>
                            <td style={{ padding: "0.75rem" }}>{platoon.suit}</td>
                            <td style={{ padding: "0.75rem" }}>{platoon.weapon}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
