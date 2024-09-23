import { Ship } from "../../Game/entities"
import Metadata from "../Metadata"

export default function ShipHeading({ ship }: { ship?: Ship }) {
    let name = undefined
    let from = undefined
    let to = undefined
    let eta = undefined
    let fuels = undefined
    if (ship && ship.location.position === "outer-space") {
        ({ name, fuels } = ship)
        ;({ from, to, eta } = ship.location.heading)
    }

    return (
        <div>
            Heading
            <div>
                <Metadata label="Ship" value={name} />
                <Metadata label="From" value={from} />
                <Metadata label="To" value={to} />
                <Metadata label="ETA" value={eta} />
                <Metadata label="Fuel" value={fuels} />
            </div>
        </div>
    )
}
