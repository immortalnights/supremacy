import { useActionData } from "react-router-dom"
import {
    store,
    sessionAtom,
    dateAtom,
    planetsAtom,
    shipsAtom,
    platoonsAtom,
} from "./store"
import { GameConfiguration, GameData, GameSession } from "Supremacy/types"
import { Navigate } from "react-router-dom"
import { Platoon, Ship } from "Supremacy/entities"
import {
    DataChannelMessageHandler,
    useManager,
    usePeerConnection,
} from "webrtc-lobby-lib"
import { useCallback, useEffect, useState } from "react"
import { useAtom } from "jotai"
import {
    initializeMultiplayerGame,
    initializeSinglePlayerGame,
    saveGame,
} from "Supremacy/setup"

type SetupState =
    | "initializing"
    | "synchronizing"
    | "creating"
    | "waiting"
    | "ready"
    | "error"

const useMultiplayer2 = ({ onReady }: { onReady: () => void; onError: () => void }) => {
    const { send, subscribe, unsubscribe } = usePeerConnection()
    const { player: localPlayer, game } = useManager()
    const [session, setSession] = useAtom(sessionAtom)
    const [state, setState] = useState<SetupState>("initializing")
    const hydrateAtoms = useCallback((data: GameData) => {
        // store.set(simulationSpeedAtom, "normal")
        store.set(dateAtom, 0)
        store.set(planetsAtom, data.planets)
        store.set(shipsAtom, [] as Ship[])
        store.set(platoonsAtom, [] as Platoon[])
    }, [])

    useEffect(() => {
        let peerMessageHandler: DataChannelMessageHandler | undefined

        if (localPlayer) {
            if (localPlayer.host) {
                peerMessageHandler = (peer, { name, body }) => {
                    console.debug("Host received message", name)
                    if (name === "session-synchronization") {
                        setSession({
                            id: game ?? "unknown",
                            difficulty: "Easy",
                            multiplayer: true,
                            host: localPlayer?.host,
                            localPlayer: localPlayer.id,
                            player1: {
                                id: localPlayer.id,
                                name: localPlayer.name,
                            },
                            player2: (body as any).player2,
                            created: "",
                            playtime: 0,
                        })
                        setState("creating")
                    } else if (name === "initialize-synchronization-complete") {
                        send("game-start", {})
                        setState("ready")
                        onReady()
                    }
                }
            } else {
                peerMessageHandler = (peer, { name, body }) => {
                    console.debug("Client received message", name)
                    if (name === "session-synchronization") {
                        setSession({
                            id: game ?? "unknown",
                            difficulty: (body as any).difficulty,
                            multiplayer: true,
                            host: localPlayer?.host,
                            localPlayer: localPlayer?.id,
                            player1: (body as any).player1,
                            player2: {
                                id: localPlayer?.id,
                                name: localPlayer?.name,
                            },
                            created: "",
                            playtime: 0,
                        })
                        setState("waiting")
                    } else if (name === "initial-game-data") {
                        hydrateAtoms(body as GameData)
                        console.debug("client sending init-sync-complete")
                        send("initialize-synchronization-complete", {})
                    } else if (name === "game-start") {
                        setState("ready")
                        onReady()
                    }
                }
            }
            subscribe(peerMessageHandler)
        }

        return () => {
            if (peerMessageHandler) {
                unsubscribe(peerMessageHandler)
            }
        }
    }, [
        localPlayer,
        subscribe,
        unsubscribe,
        send,
        setSession,
        game,
        hydrateAtoms,
        onReady,
    ])

    useEffect(() => {
        switch (state) {
            case "initializing": {
                break
            }
            case "synchronizing": {
                if (localPlayer) {
                    let data
                    if (localPlayer.host) {
                        data = {
                            player1: {
                                id: localPlayer.id,
                                name: localPlayer.name,
                            },
                        }
                    } else {
                        data = {
                            player2: {
                                id: localPlayer.id,
                                name: localPlayer.name,
                            },
                        }
                    }
                    send("session-synchronization", data)
                }
                break
            }
            case "creating": {
                if (localPlayer?.host && session?.player1?.id && session?.player2?.id) {
                    const data = initializeMultiplayerGame(
                        "Easy",
                        8,
                        session?.player1?.id,
                        session?.player2?.id,
                    )
                    hydrateAtoms(data)
                    send("initial-game-data", data)
                    setState("waiting")
                } else {
                    setState("waiting")
                }
                break
            }
            case "waiting": {
                break
            }
            case "ready": {
                break
            }
            case "error": {
                break
            }
        }
    }, [localPlayer, session, send, state, hydrateAtoms])

    return useCallback(() => {
        setState("synchronizing")
    }, [])
}

export default function GameSetup() {
    const configuration = useActionData() as GameConfiguration | undefined
    const [state, setState] = useState<SetupState>("initializing")
    const [session, setSession] = useAtom(sessionAtom)
    const setup = useMultiplayer2({
        onReady: () => {
            setState("ready")
        },
        onError: () => setState("error"),
    })
    const hydrateAtoms = useCallback((data: GameData) => {
        // store.set(simulationSpeedAtom, "normal")
        store.set(dateAtom, 0)
        store.set(planetsAtom, data.planets)
        store.set(shipsAtom, data.ships)
        store.set(platoonsAtom, data.platoons)
    }, [])

    console.log(configuration, session, state)

    // At the moment, multiplayer is identified by the lack of configuration
    useEffect(() => {
        if (!session) {
            if (!configuration) {
                setup()
            } else {
                const playerId = configuration.player1Id
                const data = initializeSinglePlayerGame(
                    configuration.difficulty,
                    configuration.planets,
                    playerId,
                )

                const sessionData = {
                    id: crypto.randomUUID(),
                    multiplayer: false,
                    host: true,
                    difficulty: configuration.difficulty,
                    created: new Date().toISOString(),
                    playtime: 0,
                    player1: {
                        id: playerId,
                        name: configuration.player1Name,
                    },
                    player2: undefined,
                    localPlayer: playerId,
                } satisfies GameSession

                saveGame(sessionData, "paused", data.planets, data.ships, data.platoons)

                hydrateAtoms(data)
                setSession(sessionData)
                setState("ready")
            }
        }
    }, [setup, configuration, hydrateAtoms, session, setSession])

    let content
    if (session && state === "ready") {
        content = <Navigate to={`/Game/${session.id}/SolarSystem`} replace />
    } else {
        content = <div>Loading...</div>
    }

    return content
}
