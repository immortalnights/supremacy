import { Getter, Setter } from "jotai"
import { useAtomCallback } from "jotai/utils"
import { ReactNode, createContext, useCallback, useMemo } from "react"
import { planetsAtom } from "./Game/store"

export const CommandContext = createContext<{
    exec: (command: string, data: object) => void
}>({
    exec: () => () => {
        throw new Error("Missing CommandProvider")
    },
})

export function CommandProvider({ children }: { children: ReactNode }) {
    const exec = useAtomCallback(
        useCallback(
            (get: Getter, set: Setter, command: string, data: object) => {
                console.log("exec", command, data)

                const originalPlanets = get(planetsAtom)

                const cpy = [...originalPlanets]

                const index = cpy.findIndex((p) => p.id === data.planet)
                if (index !== -1) {
                    const originalPlanet = cpy[index]
                    console.log(
                        `Renaming planet '${originalPlanet.name}' (${originalPlanet.id}) to '${data.newName}'`,
                    )
                    cpy[index] = { ...originalPlanet, name: data.newName }
                }

                set(planetsAtom, cpy)
            },
            [],
        ),
    )

    const value = useMemo(
        () => ({
            exec,
        }),
        [exec],
    )

    return (
        <CommandContext.Provider value={value}>
            {children}
        </CommandContext.Provider>
    )
}
