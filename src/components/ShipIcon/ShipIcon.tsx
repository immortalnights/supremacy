import { Ship } from "../../Game/entities"
import emptyIcon from "/images/empty.png"
import atmosIcon from "/images/atmos_icon.png"
import battleIcon from "/images/battle_icon.png"
import cargoIcon from "/images/cargo_icon.png"
import farmingIcon from "/images/farming_icon.png"
import miningIcon from "/images/mining_icon.png"
import solarIcon from "/images/solar_icon.png"

const iconMap: { [Key in Ship["class"]]: string } = {
    atmos: atmosIcon,
    battle: battleIcon,
    cargo: cargoIcon,
    farming: farmingIcon,
    mining: miningIcon,
    solar: solarIcon,
}

export default function ShipIcon({ ship }: { ship?: Ship }) {
    let img = emptyIcon
    if (ship) {
        img = iconMap[ship.class]
    } else {
        img = emptyIcon
    }

    return <img style={{}} src={img} />
}
