import { useActionData } from "react-router-dom"
import {
    store,
    sessionAtom,
    stateAtom,
    dateAtom,
    planetsAtom,
    shipsAtom,
    platoonsAtom,
} from "./Game/store"
import { GameSession, GameSettings, type Difficulty } from "./Game/types"
import { Navigate } from "react-router-dom"
import { Planet, Platoon, Ship } from "./Game/entities"
import { useManager, usePeerConnection } from "webrtc-lobby-lib"
import { PlayerRecord } from "game-signaling-server/client"
import { useHydrateAtoms } from "jotai/utils"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { useAtom, useAtomValue } from "jotai"

interface GameData {
    id: string
    name: string
    multiplayer: boolean
    planets: Planet[]
    ships: Ship[]
    platoons: Platoon[]
}

const setupNewGame = ({
    difficulty,
    multiplayer,
    player1,
    player2,
}: GameSettings): GameData => {
    const planetsForDifficulty: { [K in Difficulty]: number } = {
        easy: 8,
        medium: 16,
        hard: 32,
        impossible: 32,
    }

    const defaultPlanets = Array.from<unknown, Planet>(
        { length: planetsForDifficulty[difficulty] },
        (_, index) => ({
            id: String(index),
            name: "",
            gridIndex: index,
        }),
    )

    // EnemyBase (single player)
    defaultPlanets[0] = {
        ...defaultPlanets[0],
        name: multiplayer ? "Homebase!" : "EnemyBase",
        owner: player2.id,
        capital: true,
        credits: 1000,
        food: 1000,
        minerals: 1000,
        fuels: 1000,
        energy: 1000,
        population: 1000,
        growth: 0,
        moral: 0,
        tax: 10,
    }

    const lastPlanet = defaultPlanets[defaultPlanets.length - 1]
    defaultPlanets[defaultPlanets.length - 1] = {
        ...lastPlanet,
        name: "Homebase!",
        owner: player1.id,
        capital: true,
        credits: 1000,
        food: 1000,
        minerals: 1000,
        fuels: 1000,
        energy: 1000,
        population: 1000,
        growth: 0,
        moral: 0,
        tax: 10,
    }

    return {
        id: "unknown",
        name: "unnamed",
        multiplayer,
        planets: defaultPlanets,
        ships: [],
        platoons: [],
    }
}

const loadSavedGame = ({ id }: GameSettings): GameData | undefined => {
    let data
    if (window.localStorage) {
        const raw = window.localStorage.get(`supremacy_${id}`)
        if (raw) {
            try {
                data = JSON.parse(raw)
            } catch (err) {
                console.error(`Failed to parse save game data for '${id}'`)
                console.error(err)
            }
        }
    }

    // Perform sanity checks on loaded data

    return data as GameData
}

const initializeGameData = (
    settings: GameSettings | undefined,
    session: GameSession,
): GameData | undefined => {
    let data

    // FIXME: Navigation from the Lobby does not submit any data
    if (settings && !settings.multiplayer) {
        if (settings.id) {
            // Host, load game
            data = loadSavedGame(settings)
        } else {
            // Host, setup game
            data = setupNewGame(settings)
        }
    } else {
        data = setupNewGame(session)
    }

    return data
}

type SetupState =
    | "initializing"
    | "synchronizing"
    | "creating"
    | "waiting"
    | "ready"
    | "error"

export default function GameSetup() {
    const settings = useActionData() as GameSettings | undefined
    const isMultiplayer = !settings
    const { send, subscribe, unsubscribe } = usePeerConnection()
    const { state: mpState, player: localPlayer, room, game } = useManager()
    const [state, setState] = useState<SetupState>("initializing")
    const hydrateAtoms = useCallback((data: GameData) => {
        store.set(stateAtom, "playing")
        store.set(dateAtom, 0)
        store.set(planetsAtom, data.planets)
        store.set(shipsAtom, [] as Ship[])
        store.set(platoonsAtom, [] as Platoon[])
    }, [])
    // FIXME writable because multiplayer manager data is incomplete...
    const [session, setSession] = useAtom(sessionAtom)

    // FIXME is invalid at the moment
    const otherPlayer = useMemo(
        () =>
            isMultiplayer ? { id: "remote", name: "Remote Player" } : undefined,
        [isMultiplayer],
    )
    // room.players.find((p) => p.id !== player.id) ??
    // throwError("Failed to find other player")
    console.log(state, mpState, settings, room, game)

    // hacky, but currently the only way to know

    // Message handler effect
    useEffect(() => {
        console.debug("Message handler effect", [
            localPlayer,
            send,
            subscribe,
            unsubscribe,
        ])

        let peerMessageHandler

        if (localPlayer?.host) {
            peerMessageHandler = (peer, { name, body }) => {
                console.debug("Player (host) received", name, body)
                // FIXME session synchronization compensates for the lack of information within
                // the multiplayer manager context
                if (name === "session-synchronization") {
                    setSession({
                        id: game,
                        difficulty: "easy",
                        multiplayer: true,
                        host: localPlayer?.host,
                        localPlayer: localPlayer.id,
                        player1: { id: localPlayer.id, name: localPlayer.name },
                        player2: body.player2,
                    })
                    setState("creating")
                } else if (name === "initialize-synchronization-complete") {
                    send("game-start", {})
                    setState("ready")
                }
            }
        } else {
            peerMessageHandler = (peer, { name, body }) => {
                console.debug("Player (not host) received", name, body)
                if (name === "session-synchronization") {
                    setSession({
                        id: game,
                        difficulty: body.difficulty,
                        multiplayer: true,
                        host: localPlayer?.host,
                        localPlayer: localPlayer?.id,
                        player1: body.player1,
                        player2: {
                            id: localPlayer?.id,
                            name: localPlayer?.name,
                        },
                    })
                    setState("waiting")
                } else if (name === "initial-game-data") {
                    hydrateAtoms(body as GameData)
                    // FIXME send player2 id to server, but it should know it!
                    send("initialize-synchronization-complete", {})
                } else if (name === "game-start") {
                    setState("ready")
                }
            }
        }

        subscribe(peerMessageHandler)

        return () => {
            unsubscribe(peerMessageHandler)
        }
    }, [
        hydrateAtoms,
        game,
        localPlayer,
        setSession,
        send,
        subscribe,
        unsubscribe,
    ])

    // Setup effect
    useEffect(() => {
        console.debug("Creation effect", [
            state,
            settings,
            localPlayer,
            otherPlayer,
            send,
        ])
        if (state === "initializing") {
            setTimeout(() => {
                setState("synchronizing")
            }, 500)
        } else if (state === "synchronizing") {
            let data
            if (localPlayer?.host) {
                data = {
                    player1: { id: localPlayer.id, name: localPlayer.name },
                }
            } else {
                data = {
                    player2: { id: localPlayer.id, name: localPlayer.name },
                }
            }

            send("session-synchronization", data)
        } else if (state === "creating") {
            const data = initializeGameData(settings, session)

            if (!data) {
                setState("error")
            } else {
                if (localPlayer?.host) {
                    hydrateAtoms(data)
                    send("initial-game-data", data)
                    setState("waiting")
                } else {
                    setState("ready")
                }
            }
        } else {
            // Nothing
        }
    }, [
        hydrateAtoms,
        state,
        game,
        settings,
        session,
        localPlayer,
        otherPlayer,
        send,
    ])

    const redirect = session && (
        <Navigate to={`/Game/${session.id}/SolarSystem`} replace />
    )

    let content = <div>Loading...</div>
    if (state === "ready") {
        content = redirect
    }

    return content
}
