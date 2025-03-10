import { ColonizedPlanet, Planet, Platoon, Ship } from "Game/entities"
import { GameState } from "webrtc-lobby-lib/Game/GameProvider"

/** */
const planetManager = (
    planet: ColonizedPlanet,
    planets: Planet[],
    ships: Ship[],
    platoons: Platoon[],
) => {}

const fleetManager = (ships: Ship[], planets: Planet[], platoons: Platoon[]) => {}

const platoonManager = (platoons: Platoon[], planets: Planet[], ships: Ship[]) => {}

export const process = (planets: Planet[], ships: Ship[], platoons: Platoon[]) => {}
