import { type ShipClass } from "../entities"
import { type BotDifficulty } from "./types"

// ShipClass to BotDifficulty, max
export const shipLimits: Record<ShipClass, Record<BotDifficulty, number>> = {
    "Atmosphere Processor": {
        Easy: 1,
        Normal: 1,
        Hard: 1,
        Elite: 1,
    },
    "B-29 Battle Cruiser": {
        Easy: 1,
        Normal: 1,
        Hard: 2,
        Elite: 3,
    },
    "Cargo Store / Carrier": {
        Easy: 1,
        Normal: 1,
        Hard: 1,
        Elite: 1,
    },
    "Core Mining Station": {
        Easy: 0,
        Normal: 0,
        Hard: 1,
        Elite: 2,
    },
    "Horticultural Station": {
        Easy: 2,
        Normal: 2,
        Hard: 3,
        Elite: 4,
    },
    "Solar-Satellite Generator": {
        Easy: 2,
        Normal: 3,
        Hard: 4,
        Elite: 5,
    },
}
