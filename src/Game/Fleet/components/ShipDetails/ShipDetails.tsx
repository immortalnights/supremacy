import { Ship } from "Game/entities"
import Date from "Game/components/Date"
import Metadata, { MetadataLabel, MetadataValue } from "Game/components/Metadata"

export default function ShipDetails({ ship }: { ship?: Ship }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 6 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <Metadata label="Ship" value={ship?.name} alignment="right" />
                    <Date alignment="right" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <Metadata
                        label="Crew"
                        value={ship?.requiredCrew === "remote" ? "Remote" : ship?.crew}
                    />
                    <Metadata
                        label="Fuel"
                        value={ship?.fuels}
                        postfix={ship?.fuels !== "nuclear" ? "T." : ""}
                    />
                </div>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
                <MetadataLabel label="Class" textAlign="right" />
                <MetadataValue label="Class" value={ship?.class} textAlign="center" />
                <div
                    style={{
                        width: 80,
                        textAlign: "left",
                    }}
                >
                    Class
                </div>
            </div>
        </div>
    )
}
