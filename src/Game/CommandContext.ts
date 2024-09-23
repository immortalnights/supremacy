import { createContext } from "react"

export const CommandContext = createContext<{
    exec: (command: string, data: object) => void
}>({
    exec: () => () => {
        throw new Error("Missing CommandProvider")
    },
})
