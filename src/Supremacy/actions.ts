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
    applyActivateShip,
    canActivateShip,
} from "./actions/index"
import { getShipBlueprint } from "./data/ships"
import { ColonizedPlanet, Ship, ShipClass, ShipDocked, ShipPosition } from "./entities"
import { GameState } from "./types"

export type GameAction = (state: GameState) => GameState

export interface PlanetActions {
    "planet-terraform": { id: string; name?: string }
    "planet-rename": { id: string; name: string }
    "planet-set-tax": { id: string; tax: number }
    "planet-transfer-credits": {
        fromid: string
        toid: string
        amount: number
    }
    "planet-set-aggression": { id: string; aggression: number }
}

export interface ShipActions {
    "ship-purchase": { class: ShipClass; name?: string }
    "ship-crew": { id: string; crew: number }
    "ship-decommission": { id: string }
    "ship-modify-passengers": { id: string; passengers: number }
    "ship-modify-fuel": { id: string; fuel: number }
    "ship-load-cargo": { id: string; cargoType: string; amount: number }
    "ship-unload-cargo": { id: string }
    "ship-reposition": { id: string; destination: ShipPosition }
    "ship-transfer": { id: string; destination: string }
    "ship-toggle": { id: string; active?: boolean }
}

export interface PlatoonActions {
    "platoon-modify-troops": { id: string; troops: number }
    "platoon-modify-suit": { id: string; suitType: string }
    "platoon-modify-weapon": { id: string; weaponType: string }
    "platoon-equip": { id: string; equipment: string }
    "platoon-board-ship": { id: string; shipId: string }
    "platoon-disembark-ship": { id: string; shipId: string }
}

export type Actions = PlanetActions & ShipActions & PlatoonActions

export type Action = keyof Actions

export interface ActionObject<T extends Action = Action> {
    type: T
    payload: Actions[T]
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
    "planet-terraform": {
        validate: (action, state) => {
            throw new Error("Function not implemented 'planet-terraform'.")
            const planet = state.planets.find((p) => p.id === action.payload.id)
            return !!planet && canRenamePlanet(action.playerId, planet, action.payload.name)
        },
        apply: (action, state) => {
            throw new Error("Function not implemented 'planet-terraform'.")
            const planet = state.planets.find((p) => p.id === action.payload.id) as ColonizedPlanet
            const modifiedPlanet = applyRenamePlanet(planet, action.payload.name)
            return apply(state, "planets", modifiedPlanet)
        },
    },
    "planet-rename": {
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
    "planet-set-tax": {
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
    "planet-transfer-credits": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'planet-transfer-credits'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'planet-transfer-credits'.")
        },
    },
    "planet-set-aggression": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'planet-set-aggression'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'planet-set-aggression'.")
        },
    },
    "ship-purchase": {
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
    "ship-crew": {
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
    "ship-decommission": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'ship-decommission'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'ship-decommission'.")
        },
    },
    "ship-modify-passengers": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'ship-modify-passengers'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'ship-modify-passengers'.")
        },
    },
    "ship-modify-fuel": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'ship-modify-fuel'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'ship-modify-fuel'.")
        },
    },
    "ship-load-cargo": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'ship-load-cargo'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'ship-load-cargo'.")
        },
    },
    "ship-unload-cargo": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'ship-unload-cargo'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'ship-unload-cargo'.")
        },
    },
    "ship-reposition": {
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
    "ship-transfer": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'ship-transfer'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'ship-transfer'.")
        },
    },
    "ship-toggle": {
        validate: function (action, state): boolean {
            const [ship, planet] = getShipAndPlanet(state, action.playerId, action.payload.id)

            const targetState = action.payload.active ?? (ship.position === "surface" && !ship.active)

            return !!ship && !!planet && canActivateShip(ship, planet, targetState)
        },
        apply: function (action, state): GameState {
            const [ship, planet] = getShipAndPlanet(state, action.playerId, action.payload.id)

            const modifiedShip = applyActivateShip(ship, planet, action.payload.active ?? false)
            return apply(state, "ships", modifiedShip)
        },
    },
    "platoon-modify-troops": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'platoon-modify-troops'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'platoon-modify-troops'.")
        },
    },
    "platoon-modify-suit": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'platoon-modify-suit'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'platoon-modify-suit'.")
        },
    },
    "platoon-modify-weapon": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'platoon-modify-weapon'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'platoon-modify-weapon'.")
        },
    },
    "platoon-equip": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'platoon-equip'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'platoon-equip'.")
        },
    },
    "platoon-board-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'platoon-board-ship'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'platoon-board-ship'.")
        },
    },
    "platoon-disembark-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented 'platoon-disembark-ship'.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented 'platoon-disembark-ship'.")
        },
    },
}
