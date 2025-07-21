import {
    canRenamePlanet,
    applyRenamePlanet,
    canModifyTax,
    applyModifyTax,
    applyPurchaseShip,
    canPurchaseShip,
    canCrewShip,
    applyCrewShip,
    canRepositionShip,
    applyRepositionShip,
} from "./actions/index"
import { getShipBlueprint } from "./data/ships"
import { ColonizedPlanet, Ship, ShipClass, ShipDocked, ShipPosition } from "./entities"
import { GameState } from "./types"

export type GameAction = (state: GameState) => GameState

export interface ActionPayloads {
    "rename-planet": { id: string; name: string }
    "set-planet-tax": { id: string; tax: number }
    "transfer-planet-credits": {
        fromid: string
        toid: string
        amount: number
    }
    "modify-planet-aggression": { id: string; aggression: number }
    "purchase-ship": { class: ShipClass; name: string }
    "crew-ship": { id: string; crew: number }
    "unload-ship": { id: string }
    "decommission-ship": { id: string }
    "modify-passengers": { id: string; passengers: number }
    "modify-fuel": { id: string; fuel: number }
    "load-cargo": { id: string; cargoType: string; amount: number }
    "unload-cargo": { id: string; cargoType: string; amount: number }
    "reposition-ship": { id: string; destination: ShipPosition }
    "transfer-ship": { id: string; planetId: string }
    "toggle-ship": { id: string; active?: boolean }
    "modify-platoon-troops": { id: string; troops: number }
    "modify-platoon-suit": { id: string; suitType: string }
    "modify-platoon-weapon": { id: string; weaponType: string }
    "equip-platoon": { id: string; equipment: string }
    "load-platoon": { id: string; shipId: string }
    "unload-platoon": { id: string; shipId: string }
}

export type Action = keyof ActionPayloads

export interface ActionObject<T extends Action = Action> {
    type: T
    payload: ActionPayloads[T]
    playerId: string
}

export const translateAction = <T extends Action>(action: ActionObject<T>): GameAction => {
    const handler = actionHandlers[action.type]
    return (state) => {
        if (handler.validate(action, state)) {
            return handler.apply(action, state)
        } else {
            console.warn(`Action ${action.type} failed validation`, action)
            return state
        }
    }
}

type ActionHandler<T extends Action = Action> = {
    validate: (action: ActionObject<T>, state: GameState) => boolean
    apply: (action: ActionObject<T>, state: GameState) => GameState
}

type ArrayKeys<T> = {
    [K in keyof T]: T[K] extends Array<any> ? K : never
}[keyof T]

type ArrayElement<T> = T extends (infer U)[] ? U : never

// Helper function to apply changes to the game state
const apply = <K extends ArrayKeys<GameState>>(
    state: GameState,
    key: K,
    value: ArrayElement<GameState[K]>,
): GameState => {
    const cpy = [...state[key]]
    const index = cpy.findIndex((item) => item.id === value.id)
    if (index !== -1) {
        cpy[index] = value
    } else {
        console.error(`Item with id ${value.id} not found in ${key}`)
    }
    return {
        ...state,
        [key]: cpy,
    }
}

// Helper function to append to the game state
const append = <K extends ArrayKeys<GameState>>(
    state: GameState,
    key: K,
    value: ArrayElement<GameState[K]>,
): GameState => {
    return {
        ...state,
        [key]: [...state[key], value],
    }
}

// Helper function to find a ship by it's ID and owner and the planet it's located at
const getShipAndPlanet = (state: GameState, player: string, shipId: string): [Ship, ColonizedPlanet] => {
    const ship = state.ships.find((s) => s.id === shipId && s.owner === player)
    if (!ship) {
        throw new Error(`Ship not found for id ${shipId}`)
    }

    // Planet the ship is located at (ownership isn't checked as some actions can be performed on enemy planets)
    const planet = state.planets.find(
        (p): p is ColonizedPlanet =>
            ship?.position !== "outer-space" && p.id === ship?.location.planet && p.type !== "lifeless",
    )
    if (!planet) {
        throw new Error(`Planet not found for ship ${ship.id}`)
    }

    return [ship, planet] as const
}

export const actionHandlers: {
    [K in Action]: ActionHandler<K>
} = {
    "rename-planet": {
        validate: (action, state) => {
            const planet = state.planets.find((p) => p.id === action.payload.id)
            return !!planet && canRenamePlanet(action.playerId, planet, action.payload.name)
        },
        apply: (action, state) => {
            const planet = state.planets.find((p) => p.id === action.payload.id) as ColonizedPlanet
            const modifiedPlanet = applyRenamePlanet(planet, action.payload.name)
            return apply(state, "planets", modifiedPlanet)
        },
    },
    "set-planet-tax": {
        validate: function (action, state): boolean {
            const planet = state.planets.find((p) => p.id === action.payload.id)
            return !!planet && canModifyTax(action.playerId, planet, action.payload.tax)
        },
        apply: function (action, state): GameState {
            const planet = state.planets.find((p) => p.id === action.payload.id) as ColonizedPlanet
            const modifiedPlanet = applyModifyTax(planet, action.payload.tax)
            return apply(state, "planets", modifiedPlanet)
        },
    },
    "transfer-planet-credits": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'transfer-planet-credits'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'transfer-planet-credits'.")
        },
    },
    "modify-planet-aggression": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'modify-planet-aggression'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'modify-planet-aggression'.")
        },
    },
    "purchase-ship": {
        validate: function (action, state): boolean {
            // Purchases happen at the capital, only
            const planet = state.planets.find(
                (p): p is ColonizedPlanet => p.type !== "lifeless" && p.owner === action.playerId && p.capital,
            )
            const ownedShips = state.ships.filter(
                (ship) => ship.owner === action.playerId && ship.position === "docked",
            )
            const blueprint = getShipBlueprint(action.payload.class)

            return !!planet && canPurchaseShip(planet, ownedShips, blueprint, state.date, state.difficulty)
        },
        apply: function (action, state): GameState {
            const planet = state.planets.find(
                (p): p is ColonizedPlanet => p.type !== "lifeless" && p.owner === action.playerId && p.capital,
            )
            if (!planet) {
                throw new Error(`No capital planet found for player ${action.playerId}`)
            }

            const ownedShips = state.ships.filter(
                (ship) => ship.owner === action.playerId && ship.position === "docked",
            )

            const blueprint = getShipBlueprint(action.payload.class)

            const payload = action.payload
            const [modifiedPlanet, modifiedShip] = applyPurchaseShip(
                planet,
                ownedShips,
                blueprint,
                payload.name,
                state.date,
                state.difficulty,
            )

            state = apply(state, "planets", modifiedPlanet)
            state = append(state, "ships", modifiedShip)
            return state
        },
    },
    "crew-ship": {
        validate: function (action, state): boolean {
            const [ship, planet] = getShipAndPlanet(state, action.playerId, action.payload.id)

            return !!ship && !!planet && canCrewShip(ship, planet)
        },
        apply: function (action, state): GameState {
            const [ship, planet] = getShipAndPlanet(state, action.playerId, action.payload.id)

            const [modifiedPlanet, modifiedShip] = applyCrewShip(ship, planet)

            state = apply(state, "planets", modifiedPlanet)
            state = apply(state, "ships", modifiedShip)
            return state
        },
    },
    "unload-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'unload-ship'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'unload-ship'.")
        },
    },
    "decommission-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'decommission-ship'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'decommission-ship'.")
        },
    },
    "modify-passengers": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'modify-passengers'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'modify-passengers'.")
        },
    },
    "modify-fuel": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'modify-fuel'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'modify-fuel'.")
        },
    },
    "load-cargo": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'load-cargo'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'load-cargo'.")
        },
    },
    "unload-cargo": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'unload-cargo'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'unload-cargo'.")
        },
    },
    "reposition-ship": {
        validate: function (action, state): boolean {
            const [ship, planet] = getShipAndPlanet(state, action.playerId, action.payload.id)
            const shipsAtPlanet = state.ships.filter(
                (ship) => ship.position !== "outer-space" && ship.location.planet === planet.id,
            )

            return !!ship && !!planet && canRepositionShip(ship, planet, shipsAtPlanet, action.payload.destination)
        },
        apply: function (action, state): GameState {
            const [ship, planet] = getShipAndPlanet(state, action.playerId, action.payload.id)
            const shipsAtPlanet = state.ships.filter(
                (ship) => ship.position !== "outer-space" && ship.location.planet === planet.id,
            )

            const modifiedShip = applyRepositionShip(ship, planet, shipsAtPlanet, action.payload.destination)
            return apply(state, "ships", modifiedShip)
        },
    },
    "transfer-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'transfer-ship'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'transfer-ship'.")
        },
    },
    "toggle-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'toggle-ship'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'toggle-ship'.")
        },
    },
    "modify-platoon-troops": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'modify-platoon-troops'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'modify-platoon-troops'.")
        },
    },
    "modify-platoon-suit": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'modify-platoon-suit'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'modify-platoon-suit'.")
        },
    },
    "modify-platoon-weapon": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'modify-platoon-weapon'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'modify-platoon-weapon'.")
        },
    },
    "equip-platoon": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'equip-platoon'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'equip-platoon'.")
        },
    },
    "load-platoon": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'load-platoon'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'load-platoon'.")
        },
    },
    "unload-platoon": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'unload-platoon'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'unload-platoon'.")
        },
    },
}
