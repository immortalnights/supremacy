import { canRenamePlanet, applyRenamePlanet } from "./actions/planet"
import { GameState } from "./types"

export type GameAction = (state: GameState) => GameState

export interface ActionPayloads {
    "rename-planet": { id: string; newName: string }
    "set-planet-tax": { planetId: string; tax: number }
    "transfer-planet-credits": {
        fromPlanetId: string
        toPlanetId: string
        amount: number
    }
    "modify-planet-aggression": { planetId: string; aggression: number }
    "purchase-ship": { shipType: string; planetId: string }
    "crew-ship": { shipId: string; crew: number }
    "unload-ship": { shipId: string }
    "decommission-ship": { shipId: string }
    "modify-passengers": { shipId: string; passengers: number }
    "modify-fuel": { shipId: string; fuel: number }
    "load-cargo": { shipId: string; cargoType: string; amount: number }
    "unload-cargo": { shipId: string; cargoType: string; amount: number }
    "transition-ship": { shipId: string; destination: string }
    "transfer-ship": { shipId: string; toPlayerId: string }
    "toggle-ship": { shipId: string }
    "modify-platoon-troops": { platoonId: string; troops: number }
    "modify-platoon-suit": { platoonId: string; suitType: string }
    "modify-platoon-weapon": { platoonId: string; weaponType: string }
    "equip-platoon": { platoonId: string; equipment: string }
    "load-platoon": { platoonId: string; shipId: string }
    "unload-platoon": { platoonId: string; shipId: string }
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

export const actionHandlers: {
    [K in Action]: ActionHandler<K>
} = {
    "rename-planet": {
        validate: (action, state) => {
            const planet = state.planets.find((p) => p.id === action.payload.id)
            return !!planet && canRenamePlanet(action.playerId, planet, action.payload.newName)
        },
        apply: (action, state) => {
            state.planets = applyRenamePlanet(state.planets, action.payload.id, action.payload.newName)
            return state
        },
    },
    "set-planet-tax": {
        validate: function (action: ActionObject<"set-planet-tax">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"set-planet-tax">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "transfer-planet-credits": {
        validate: function (action: ActionObject<"transfer-planet-credits">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"transfer-planet-credits">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-planet-aggression": {
        validate: function (action: ActionObject<"modify-planet-aggression">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"modify-planet-aggression">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "purchase-ship": {
        validate: function (action: ActionObject<"purchase-ship">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"purchase-ship">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "crew-ship": {
        validate: function (action: ActionObject<"crew-ship">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"crew-ship">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "unload-ship": {
        validate: function (action: ActionObject<"unload-ship">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"unload-ship">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "decommission-ship": {
        validate: function (action: ActionObject<"decommission-ship">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"decommission-ship">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-passengers": {
        validate: function (action: ActionObject<"modify-passengers">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"modify-passengers">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-fuel": {
        validate: function (action: ActionObject<"modify-fuel">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"modify-fuel">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "load-cargo": {
        validate: function (action: ActionObject<"load-cargo">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"load-cargo">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "unload-cargo": {
        validate: function (action: ActionObject<"unload-cargo">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"unload-cargo">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "transition-ship": {
        validate: function (action: ActionObject<"transition-ship">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"transition-ship">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "transfer-ship": {
        validate: function (action: ActionObject<"transfer-ship">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"transfer-ship">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "toggle-ship": {
        validate: function (action: ActionObject<"toggle-ship">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"toggle-ship">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-platoon-troops": {
        validate: function (action: ActionObject<"modify-platoon-troops">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"modify-platoon-troops">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-platoon-suit": {
        validate: function (action: ActionObject<"modify-platoon-suit">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"modify-platoon-suit">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "modify-platoon-weapon": {
        validate: function (action: ActionObject<"modify-platoon-weapon">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"modify-platoon-weapon">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "equip-platoon": {
        validate: function (action: ActionObject<"equip-platoon">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"equip-platoon">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "load-platoon": {
        validate: function (action: ActionObject<"load-platoon">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"load-platoon">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
    "unload-platoon": {
        validate: function (action: ActionObject<"unload-platoon">, state: GameState): boolean {
            throw new Error("Function not implemented.")
        },
        apply: function (action: ActionObject<"unload-platoon">, state: GameState): GameState {
            throw new Error("Function not implemented.")
        },
    },
}
