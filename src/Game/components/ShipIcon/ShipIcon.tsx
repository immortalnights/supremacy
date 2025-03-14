import { Ship } from "Supremacy/entities"
import emptyIcon from "/images/empty.png"
import atmosIcon from "/images/atmos_icon.png"
import battleIcon from "/images/battle_icon.png"
import cargoIcon from "/images/cargo_icon.png"
import farmingIcon from "/images/farming_icon.png"
import miningIcon from "/images/mining_icon.png"
import solarIcon from "/images/solar_icon.png"

const iconMap: { [Key in Ship["class"]]: string } = {
    "B-29 Battle Cruiser": battleIcon,
    "Solar-Satellite Generator": solarIcon,
    "Atmosphere Processor": atmosIcon,
    "Cargo Store / Carrier": cargoIcon,
    "Core Mining Station": miningIcon,
    "Horticultural Station": farmingIcon,
}

export default function ShipIcon({
    ship,
    style,
}: {
    ship?: Ship
    style?: React.CSSProperties
}) {
    let img = emptyIcon
    if (ship) {
        img = iconMap[ship.class]
    } else {
        img = emptyIcon
    }

    return <img src={img} style={style} />
}
