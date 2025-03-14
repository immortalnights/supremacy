import { Ship } from "Supremacy/entities"
import Button from "components/Button"
import ShipIcon from "../ShipIcon"

function Item({ ship, onClick }: { ship?: Ship; onClick: (ship: Ship) => void }) {
    const handleClick = () => {
        if (ship) {
            onClick(ship)
        }
    }

    return (
        <Button onClick={handleClick} style={{ flexDirection: "column" }}>
            <ShipIcon ship={ship} />
            <div style={{ height: "1.4em", textTransform: "uppercase" }}>
                {ship?.name}
            </div>
        </Button>
    )
}

export default function ShipLocationGrid({
    ships,
    onClick,
}: {
    ships: Ship[]
    onClick: (ship: Ship) => void
}) {
    let items = ships.map((ship, index) => (
        <Item key={`L${index}${ship.name}`} ship={ship} onClick={onClick} />
    ))

    const remaining = 6 - ships.length

    if (remaining > 0) {
        items = [
            ...items,
            ...Array(remaining)
                .fill(undefined)
                .map((_, index) => (
                    <Item key={`L${ships.length + index}`} onClick={onClick} />
                )),
        ]
    }

    return <div style={{ maxWidth: 240 }}>{items}</div>
}
