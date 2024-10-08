import { useAtom } from "jotai"
import { useCallback, useState, useEffect } from "react"
import { useParams, Navigate } from "react-router-dom"
import { Ship, Platoon } from "./entities"
import {
    sessionAtom,
    store,
    simulationSpeedAtom,
    dateAtom,
    planetsAtom,
    shipsAtom,
    platoonsAtom,
} from "./store"
import { GameData } from "./types"
import { loadSavedGame } from "./gameSetupUtilities"

export default function GameSessionBoundary() {
    const { id } = useParams()
    const [session, setSession] = useAtom(sessionAtom)
    const hydrateAtoms = useCallback((data: GameData) => {
        store.set(simulationSpeedAtom, "paused")
        store.set(dateAtom, 0)
        store.set(planetsAtom, data.planets)
        store.set(shipsAtom, [] as Ship[])
        store.set(platoonsAtom, [] as Platoon[])
    }, [])
    const [state, setState] = useState<"loading" | "ready" | "failed">(
        "loading",
    )

    useEffect(() => {
        if (id) {
            const savedGame = loadSavedGame(id)
            if (savedGame) {
                hydrateAtoms(savedGame)
                setSession(savedGame.session)
                setState("ready")
            } else {
                setState("failed")
            }
        } else {
            setState("failed")
        }
    }, [id, hydrateAtoms, setSession])

    console.log(state, session)

    let content = <>Loading...</>
    if (state === "ready") {
        content = <Navigate to={`/Game/${id}/SolarSystem`} />
    } else if (state === "failed") {
        content = <Navigate to="/" />
    }

    return content
}
