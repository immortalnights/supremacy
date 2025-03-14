import { ColonizedPlanet, Planet, Ship } from "Supremacy/entities"
import Button from "components/Button"
import { shipsDocketAtPlanetAtom } from "../../store"
import { useAtomValue } from "jotai"

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
    planet: ColonizedPlanet
    onClick: (ship: Ship) => void
}) {
    const ships = useAtomValue(shipsDocketAtPlanetAtom).filter(planet)

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
                        const ship = ships.find((ship) => ship.location.index === index)
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
