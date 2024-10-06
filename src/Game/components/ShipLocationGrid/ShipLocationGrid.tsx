import { Ship } from "../../entities"
import Button from "components/Button"
import ShipIcon from "../ShipIcon"

function Item({
    ship,
    onClick,
}: {
    ship?: Ship
    onClick: (ship: Ship) => void
}) {
    const handleClick = () => {
        if (ship) {
            onClick(ship)
        }
    }

    return (
        <Button onClick={handleClick}>
            <ShipIcon ship={ship} />
            <span style={{ display: "block", height: "1em" }}>
                {ship?.name}
            </span>
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
                .map((_, index) => {
                    return (
                        <Item
                            key={`L${ships.length + index}`}
                            onClick={onClick}
                        />
                    )
                }),
        ]
    }

    return (
        <div style={{ columnCount: 3, columnGap: 0, maxWidth: 80 * 3 }}>
            {items}
        </div>
    )
}