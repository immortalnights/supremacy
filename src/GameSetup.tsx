import { useActionData } from "react-router-dom"
import {
    store,
    stateAtom,
    dateAtom,
    planetsAtom,
    shipsAtom,
    platoonsAtom,
} from "./Game/store"
import { GameSettings, type Difficulty } from "./Game/types"
import { Navigate } from "react-router-dom"
import { Planet, Platoon, Ship } from "./Game/entities"
import { useManager, usePeerConnection } from "webrtc-lobby-lib"
import { PlayerRecord, throwError } from "game-signaling-server/client"
import { useHydrateAtoms } from "jotai/utils"
import { ReactNode, useEffect, useMemo, useState } from "react"

interface GameData {
    id: string
    planets: Planet[]
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

    return { id: crypto.randomUUID(), planets: defaultPlanets }
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

const HydrateGameStateAtoms = ({
    data,
    children,
}: {
    data: GameData
    // initialValues: Parameters<typeof useHydrateAtoms>[0]
    children?: ReactNode
}) => {
    console.log("hydrate with", data)
    // Transform game data into hydration data
    const initialValues = [
        [stateAtom, "playing"],
        [dateAtom, 0],
        [planetsAtom, data.planets],
        [shipsAtom, [] as Ship[]],
        [platoonsAtom, [] as Platoon[]],
    ] as const

    useHydrateAtoms(initialValues)
    return children
}

const initializeGameData = (
    settings: GameSettings,
    hostPlayer: PlayerRecord,
    remotePlayer: PlayerRecord,
): GameData | undefined => {
    let data

    // FIXME: Navigation from the Lobby does not submit any data
    if (settings && !settings.multiplayer) {
        if (settings.host) {
            if (settings.id) {
                // Host, load game
                data = loadSavedGame(settings)
            } else {
                // Host, setup game
                data = setupNewGame(settings)
            }
        } else {
        }
    } else if (hostPlayer && remotePlayer) {
        if (hostPlayer.host) {
            // if (settings.id) {
            //     // Host, load game
            //     data = loadSavedGame(settings)
            // } else {
            // Host, setup game
            data = setupNewGame({
                id: undefined,
                multiplayer: true,
                host: true,
                difficulty: "easy",
                player1: { id: hostPlayer.id, name: hostPlayer.name },
                player2: { id: remotePlayer.id, name: remotePlayer.name },
            })
            // }
        } else {
        }
    }

    return data
}

type SetupState = "creating" | "waiting" | "ready" | "error"

const getInitialState = (player?: PlayerRecord): SetupState => {
    let state
    if (!player || player.host) {
        state = "creating" as const
    } else {
        state = "waiting" as const
    }

    return state
}

export default function GameSetup() {
    const settings = useActionData() as GameSettings | undefined
    const { send, subscribe, unsubscribe, connections } = usePeerConnection()
    const { state: mpState, player, room, game } = useManager()
    const isMultiplayer = !settings
    const [state, setState] = useState<SetupState>(getInitialState(player))

    const otherPlayer = useMemo(
        () =>
            isMultiplayer ? { id: "remote", name: "Remote Player" } : undefined,
        [isMultiplayer],
    )
    // room.players.find((p) => p.id !== player.id) ??
    // throwError("Failed to find other player")

    const [data, setData] = useState<GameData | undefined>()
    console.log(state, mpState, settings, room, game)

    // hacky, but currently the only way to know

    useEffect(() => {
        console.debug("Received effect", [player, send, subscribe, unsubscribe])

        let peerMessageHandler

        if (player?.host) {
            peerMessageHandler = (peer, { name, body }) => {
                if (name === "initialize-synchronization-complete") {
                    send("game-start", {})
                    setState("ready")
                }
            }
        } else {
            peerMessageHandler = (peer, { name, body }) => {
                console.debug("received", name, body)
                if (name === "initial-game-data") {
                    setData(body as GameData)
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
    }, [player, send, subscribe, unsubscribe])

    useEffect(() => {
        console.debug("Creation effect", [
            state,
            settings,
            player,
            otherPlayer,
            send,
        ])
        if (state === "creating") {
            const data = initializeGameData(settings, player, otherPlayer)

            if (!data) {
                setState("error")
            } else {
                if (player?.host) {
                    setData(data)
                    send("initial-game-data", data)
                    setState("waiting")
                } else {
                    setState("ready")
                }
            }
        } else {
            // Nothing
        }
    }, [state, settings, player, otherPlayer, send])

    const redirect = data && (
        <Navigate to={`/Game/${data.id}/SolarSystem`} replace />
    )

    let content
    if (data) {
        content = <HydrateGameStateAtoms data={data} />
    } else {
        content = <div>Loading...</div>
    }

    if (state === "ready") {
        content = redirect
    }

    return content
}
