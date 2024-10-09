import { useShipsInDockingBay } from "Game/hooks"
import { Planet, Ship } from "Game/entities"
import { shipInLocation } from "Game/utilities"
import Button from "components/Button"

function Bay({
    number,
    ship,
    onClick,
}: {
    number: number
    ship?: Ship
    onClick: (ship: Ship) => void
}) {
    const handleClick = () => {
        if (ship) {
            onClick(ship)
        }
    }

    return (
        <div style={{ display: "flex", gap: 4 }}>
            <div>{number}</div>
            <div style={{ width: "6em", height: "1em" }}>
                {ship ? (
                    <Button
                        onClick={handleClick}
                        style={{ textTransform: "uppercase" }}
                    >
                        {ship.name}
                    </Button>
                ) : (
                    "Bay Empty"
                )}
            </div>
        </div>
    )
}

export default function DockingBay({
    planet,
    onClick,
}: {
    planet: Planet
    onClick: (ship: Ship) => void
}) {
    const ships = useShipsInDockingBay(planet)

    return (
        <div style={{ userSelect: "none" }}>
            <div>Planet</div>
            <div style={{ display: "flex" }}>
                : <div>{planet.name}</div>
            </div>
            <div>Docking Bay</div>
            <div>
                {Array(3)
                    .fill(undefined)
                    .map((_, index) => {
                        const ship = shipInLocation(ships, index)
                        return (
                            <Bay
                                key={`B${index}${ship?.name}`}
                                number={1 + index}
                                ship={ship}
                                onClick={onClick}
                            />
                        )
                    })}
            </div>
        </div>
    )
}
