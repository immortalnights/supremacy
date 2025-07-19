import { Action, ActionObject, ActionPayloads, GameAction } from "#Supremacy/actions"
import { createContext, useContext } from "react"

export type ExecFn = <T extends Action = Action>(command: T, data: ActionPayloads[T]) => void

export const CommandContext = createContext<{
    queue: GameAction[]
    exec: ExecFn
}>({
    queue: [],
    exec: () => () => {
        throw new Error("Missing CommandProvider")
    },
})

export const useCommandContext = () => {
    const context = useContext(CommandContext)
    if (!context) {
        throw new Error("useCommandContext must be used within a CommandProvider")
    }
    return context
}
