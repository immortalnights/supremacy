import { Navigate, useActionData } from "react-router-dom"
import Screen from "./Screen"
import { GameConfiguration, GameSession } from "#Supremacy/types"
import { useCallback, useEffect, useState } from "react"
import { GameState, setup } from "#Supremacy/index"
import {
    dateAtom,
    planetsAtom,
    platoonsAtom,
    sessionAtom,
    shipsAtom,
    store,
} from "Game/store"
import { useAtom, useAtomValue } from "jotai"
import { Planet, Platoon, Ship } from "#Supremacy/entities"

const useHydrateAtoms = () => {
    return useCallback(
        ({
            planets,
            ships,
            platoons,
        }: {
            planets: Planet[]
            ships: Ship[]
            platoons: Platoon[]
        }) => {
            // store.set(simulationSpeedAtom, "normal")
            store.set(dateAtom, 0)
            store.set(planetsAtom, planets)
            store.set(shipsAtom, ships)
            store.set(platoonsAtom, platoons)
        },
        [],
    )
}

const useSetupSinglePlayer = () => {
    const hydrateAtoms = useHydrateAtoms()
    const [session, setSession] = useAtom(sessionAtom)

    return useCallback((configuration: GameConfiguration) => {
        const state = setup(
            {
                seed: "",
                name: "Single Player Game", // configuration.name,
                difficulty: configuration.difficulty,
            },
            {
                id: configuration.player1Id,
                name: configuration.player1Name,
                host: true,
                ai: false,
            },
            {
                id: crypto.randomUUID(),
                name: `AI ${configuration.difficulty}`,
                host: false,
                ai: "Easy",
            },
        )

        const { planets, ships, platoons, ...rest } = state
        hydrateAtoms({ planets, ships, platoons })

        // FIXME
        setSession({
            id: crypto.randomUUID(),
            multiplayer: false,
            host: true,
            difficulty: state.difficulty,
            created: new Date().toISOString(),
            playtime: 0,
            player1: { ...state.players[0] },
            player2: { ...state.players[0] },
            localPlayer: state.players[0].id,
        })
    }, [])
}

export default function Setup() {
    // FIXME need to update types
    const configuration = useActionData() as GameConfiguration | undefined
    const session = useAtomValue(sessionAtom)
    const [progress, setProgress] = useState<"Loading" | "Ready">("Loading")
    const setupSinglePlayer = useSetupSinglePlayer()

    console.debug("Game configuration", configuration)

    // single player
    useEffect(() => {
        if (!configuration) {
            console.error("Invalid or missing game configuration")
        } else if (configuration.multiplayer) {
        } else {
            setupSinglePlayer(configuration)
            setProgress("Ready")
        }
    }, [])

    if (!configuration) {
        return <Navigate to={`/`} replace />
    }

    if (session && progress === "Ready") {
        return <Navigate to={`/Game/${session.id}/SolarSystem`} replace />
    }

    return (
        <Screen>
            <div style={{ margin: "auto", display: "flex" }}>Loading...</div>
        </Screen>
    )
}
