import { useActionData } from "react-router-dom"
import {
    store,
    sessionAtom,
    simulationSpeedAtom,
    dateAtom,
    planetsAtom,
    shipsAtom,
    platoonsAtom,
} from "./Game/store"
import {
    difficulties,
    GameConfiguration,
    GameData,
    GameSession,
    GameSettings,
    type Difficulty,
} from "./Game/types"
import { Navigate } from "react-router-dom"
import {
    ColonizedPlanet,
    LifelessPlanet,
    Planet,
    Platoon,
    Ship,
} from "./Game/entities"
import { LocalPlayer, useManager, usePeerConnection } from "webrtc-lobby-lib"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAtom } from "jotai"
import { random } from "./Game/utilities"
import {
    hydrateAtomsFromGameData,
    initializeMultiplayerGame,
    initializeSinglePlayerGame,
    saveGame,
} from "./gameSetupUtilities"

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

    // In multiplayer, both planets are created equal
    // TODO apply difficulty variant
    const playerPlanetInitial = {
        credits: random(50000, 60000),
        food: random(3000, 5000),
        minerals: random(2000, 5000),
        fuels: random(2000, 5000),
        energy: random(2000, 5000),
        population: random(1000, 2000),
    }

    const totalPlanets = planetsForDifficulty[difficulty]

    // Create AI or Player 2 planet
    let player2Planet
    if (multiplayer) {
        player2Planet = {
            id: "0",
            gridIndex: 0,
            name: "Homebase!",
            type: "metropolis",
            owner: player2.id,
            capital: true,
            ...playerPlanetInitial,
            morale: 75,
            growth: 0,
            tax: 25,
        } satisfies ColonizedPlanet
    } else {
        // TODO Apply difficult variants
        player2Planet = {
            id: "0",
            gridIndex: 0,
            name: "EnemyBase!",
            type: "metropolis",
            owner: "AI",
            capital: true,
            credits: random(50000, 60000),
            food: random(3000, 5000),
            minerals: random(2000, 5000),
            fuels: random(2000, 5000),
            energy: random(2000, 5000),
            population: random(1000, 2000),
            morale: 75,
            growth: 0,
            tax: 25,
        } satisfies ColonizedPlanet
    }

    const player1Planet = {
        id: String(totalPlanets - 1),
        gridIndex: totalPlanets - 1,
        name: "Homebase!",
        type: "metropolis",
        owner: player1.id,
        capital: true,
        ...playerPlanetInitial,
        morale: 75,
        growth: 0,
        tax: 25,
    } satisfies ColonizedPlanet

    const defaultPlanets: Planet[] = Array.from<unknown, LifelessPlanet>(
        { length: totalPlanets - 2 },
        (_, index) => ({
            id: String(1 + index),
            gridIndex: 1 + index,
            name: "",
            type: "lifeless",
        }),
    )

    defaultPlanets.unshift(player2Planet)
    defaultPlanets.push(player1Planet)

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

const useMultiplayer = () => {
    const isMultiplayer = !settings
    const { send, subscribe, unsubscribe } = usePeerConnection()
    const { player: localPlayer, room, game } = useManager()
    const [session, setSession] = useAtom(sessionAtom)
    const hydrateAtoms = useCallback((data: GameData) => {
        // store.set(simulationSpeedAtom, "normal")
        store.set(dateAtom, 0)
        store.set(planetsAtom, data.planets)
        store.set(shipsAtom, [] as Ship[])
        store.set(platoonsAtom, [] as Platoon[])
    }, [])

    // FIXME is invalid at the moment
    const otherPlayer = useMemo(
        () =>
            isMultiplayer ? { id: "remote", name: "Remote Player" } : undefined,
        [isMultiplayer],
    )

    // room.players.find((p) => p.id !== player.id) ??
    // throwError("Failed to find other player")

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
}

export default function GameSetup() {
    const configuration = useActionData() as GameConfiguration | undefined
    const [state, setState] = useState<SetupState>("initializing")
    const [session, setSession] = useAtom(sessionAtom)
    const hydrateAtoms = useCallback((data: GameData) => {
        // store.set(simulationSpeedAtom, "normal")
        store.set(dateAtom, 0)
        store.set(planetsAtom, data.planets)
        store.set(shipsAtom, [] as Ship[])
        store.set(platoonsAtom, [] as Platoon[])
    }, [])

    console.log(configuration, session, state)

    // At the moment, multiplayer is identified by the lack of configuration
    useEffect(() => {
        if (!session) {
            if (!configuration) {
                // Synch players before creating the game data
                // Once synched, redirect to game screen.
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

                saveGame(
                    sessionData,
                    "paused",
                    data.planets,
                    data.ships,
                    data.platoons,
                )

                hydrateAtoms(data)
                setSession(sessionData)
                setState("ready")
            }
        }
    }, [configuration, hydrateAtoms, session, setSession])

    const redirect = session && (
        <Navigate to={`/Game/${session.id}/SolarSystem`} replace />
    )

    let content = <div>Loading...</div>
    if (state === "ready") {
        content = redirect
    }

    return content
}
