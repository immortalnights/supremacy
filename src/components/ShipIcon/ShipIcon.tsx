import { Ship } from "../../Game/entities"
import emptyIcon from "/images/empty.png"
import farmIcon from "/images/farming.png"

const iconMap = {
    empty: emptyIcon,
    farming: farmIcon,
}

export default function ShipIcon({ ship }: { ship?: Ship }) {
    let img = emptyIcon
    if (ship) {
        img = iconMap.farming
    }

    return (
        <div
            style={{
                marginTop: 2,
                border: "1px solid lightgray",
                width: 77,
                height: 53,
                display: "flex",
                flexWrap: "wrap",
                placeContent: "center",
                background: "black",
                padding: 0,
            }}
        >
            <img src={img} />
        </div>
    )
}
