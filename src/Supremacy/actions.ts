import { canRenamePlanet, applyRenamePlanet, canModifyTax, applyModifyTax } from "./actions/planet"
import { ColonizedPlanet, isColonizedPlanet } from "./entities"
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
    "purchase-ship": { shipType: string; id: string }
    "crew-ship": { id: string; crew: number }
    "unload-ship": { id: string }
    "decommission-ship": { id: string }
    "modify-passengers": { id: string; passengers: number }
    "modify-fuel": { id: string; fuel: number }
    "load-cargo": { id: string; cargoType: string; amount: number }
    "unload-cargo": { id: string; cargoType: string; amount: number }
    "transition-ship": { id: string; destination: string }
    "transfer-ship": { id: string; planetId: string }
    "toggle-ship": { id: string }
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
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-planet-aggression": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "purchase-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "crew-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "unload-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "decommission-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-passengers": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-fuel": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "load-cargo": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "unload-cargo": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "transition-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "transfer-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "toggle-ship": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-platoon-troops": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-platoon-suit": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-platoon-weapon": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "equip-platoon": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "load-platoon": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "unload-platoon": {
        validate: function (action, state): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action, state): GameState {
            throw new Error("Function not implemented.")
        },
    },
}
