import overviewIcon from "/images/overview.png"
import shipyardIcon from "/images/shipyard.png"
import fleetIcon from "/images/fleet.png"
import atmosIcon from "/images/atmos.png"
import trainingIcon from "/images/training.png"
import cargoIcon from "/images/cargo.png"
import surfaceIcon from "/images/surface.png"
import combatIcon from "/images/combat.png"
import spyIcon from "/images/spy.png"
import saveIcon from "/images/save.png"
import Button from "../Button"
import { Link } from "react-router-dom"

const linkMap = {
    overview: { to: "Overview", icon: overviewIcon },
    shipyard: { to: "Shipyard", icon: shipyardIcon },
    fleet: { to: "Fleet", icon: fleetIcon },
    combat: { to: "Combat", icon: combatIcon },
    cargo: { to: "Cargo", icon: cargoIcon },
    surface: { to: "Surface", icon: surfaceIcon },
    training: { to: "Training", icon: trainingIcon },
    atmos: { action: "atmos", icon: atmosIcon },
    spy: { action: "spy", icon: spyIcon },
    save: { action: "save", icon: saveIcon },
} as const

export type NavigationItem = keyof typeof linkMap

export default function Navigation({
    items,
    direction = "row",
}: {
    items: NavigationItem[]
    direction?: "row" | "column"
}) {
    const links = items.map((item) => {
        const details = linkMap[item]
        let component
        if ("to" in details) {
            component = (
                <Link
                    key={item}
                    to={`../${details.to}`}
                    relative="route"
                    style={{ height: 34 }}
                >
                    <img alt={item} src={details.icon} style={{ height: 34 }} />
                </Link>
            )
        } else {
            component = (
                <Button
                    key={item}
                    onClick={() => {}}
                    style={{ width: "auto", height: 34 }}
                >
                    <img alt={item} src={details.icon} style={{ height: 34 }} />
                </Button>
            )
        }

        return component
    })

    return (
        <div
            style={{
                display: "flex",
                flexDirection: direction,
                flexWrap: "wrap",
                maxWidth: 41 * 5,
                gap: 1,
            }}
        >
            {links}
        </div>
    )
}
