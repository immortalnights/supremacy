import { IPlanet, IShip, IShipCapacity } from "@server/simulation/types"
import { totalCargo } from "../utilities/ships"

const ShipProperties = ({
    planet,
    ship,
}: {
    planet: IPlanet
    ship?: IShip
}) => {
    const details: {
        name?: string
        civilians?: number
        seats?: number
        crew?: number
        requiredCrew?: number
        crewText?: string
        capacity?: IShipCapacity
        maxFuel?: number | string
        payload?: number
        value?: number
    } = {}

    if (ship) {
        details.name = ship.name
        details.crew = ship.crew || 0
        details.requiredCrew = ship.requiredCrew || 0
        details.capacity = ship.capacity
        // FIXME
        details.payload = totalCargo(ship.cargo)
        details.value = ship.value

        if (ship.requiredCrew > 0) {
            details.crewText = details.crew + " / " + details.requiredCrew
        } else {
            details.crewText = "Remote"
        }

        details.maxFuel = details.capacity
            ? details.capacity.fuels || 0
            : "Nuclear"
    }

    return (
        <dl style={{ flexBasis: "75%" }}>
            <dt>Ship</dt>
            <dd>{details.name}</dd>
            <dt>Civilians</dt>
            <dd>{planet.population.toFixed(0)}</dd>
            <dt>Seats</dt>
            <dd>{details.capacity?.civilians || 0}</dd>
            <dt>Crew</dt>
            <dd>{details.crewText}</dd>
            <dt>Capacity</dt>
            <dd>{details.capacity?.cargo || 0}</dd>
            <dt>Max Fuel</dt>
            <dd>{details.maxFuel || 0}</dd>
            <dt>Payload</dt>
            <dd>{details.payload}</dd>
            <dt>Value</dt>
            <dd>{details.value}</dd>
        </dl>
    )
}

export default ShipProperties
