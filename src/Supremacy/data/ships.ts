import { ShipBlueprint, ShipClass } from "../entities"
import catalog from "./ships.json"

export const blueprints = catalog as ShipBlueprint[]

export const getShipBlueprint = (shipClass: ShipClass): ShipBlueprint => {
    const b = blueprints.find((ship) => ship.class === shipClass)
    if (!b) {
        throw new Error(`Ship blueprint for class '${shipClass}' not found`)
    }
    return b
}
