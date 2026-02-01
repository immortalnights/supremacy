import { useAtom, useAtomValue } from "jotai"
import { useCallback, useState, useEffect, lazy } from "react"
import { useParams, Navigate, Outlet } from "react-router-dom"
import { Ship, Platoon } from "Supremacy/entities"
import {
    sessionAtom,
    store,
    simulationSpeedAtom,
    dateAtom,
    planetsAtom,
    shipsAtom,
    platoonsAtom,
    gameStateAtom,
} from "./store"
import { GameData } from "Supremacy/types"
import { loadSavedGame } from "Supremacy/setup"

export default function GameSessionBoundary() {
    console.log("GameSessionBoundary rendering")
    // const gameState = useAtomValue(gameStateAtom)
    // const [session, setSession] = useAtom(sessionAtom)
    const [state, setState] = useState<"loading" | "ready" | "failed">("loading")

    useEffect(() => {
        // This could be replaced with a "continue" game or "load game" route solution
        const session = store.get(sessionAtom)
        const gameState = store.get(gameStateAtom)

        if (!gameState) {
            setState("failed")
        } else if (!session) {
            store.set(sessionAtom, {
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
            setState("ready")
        } else {
            setState("ready")
        }
    }, [state])

    if (state === "loading") return <>Loading...</>
    if (state === "failed") return <Navigate to="/" />
    return <Outlet />
    // const { id } = useParams()
    // const [session, setSession] = useAtom(sessionAtom)
    // const hydrateAtoms = useCallback((data: GameData) => {
    //     store.set(simulationSpeedAtom, "paused")
    //     store.set(dateAtom, 0)
    //     store.set(planetsAtom, data.planets)
    //     store.set(shipsAtom, [] as Ship[])
    //     store.set(platoonsAtom, [] as Platoon[])
    // }, [])
    // const [state, setState] = useState<"loading" | "ready" | "failed">("loading")

    // useEffect(() => {
    //     if (id) {
    //         const savedGame = loadSavedGame(id)
    //         if (savedGame) {
    //             hydrateAtoms(savedGame)
    //             setSession(savedGame.session)
    //             setState("ready")
    //         } else {
    //             setState("failed")
    //         }
    //     } else {
    //         setState("failed")
    //     }
    // }, [id, hydrateAtoms, setSession])

    // console.log(state, session)

    // let content = <>Loading...</>
    // if (state === "ready") {
    //     content = <Navigate to={`/Game/${id}/SolarSystem`} />
    // } else if (state === "failed") {
    //     content = <Navigate to="/" />
    // }

    // return content
}
