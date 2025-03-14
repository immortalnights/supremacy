import { Getter, Setter, useAtom, useAtomValue } from "jotai"
import { Outlet } from "react-router-dom"
import {
    dateAtom,
    planetsAtom,
    platoonsAtom,
    sessionAtom,
    shipsAtom,
    simulationSpeedAtom,
} from "./store"
import { CommandProvider } from "./context/CommandContextProvider"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { useAtomCallback } from "jotai/utils"
import { usePeerConnection } from "webrtc-lobby-lib"
import { ColonizedPlanet, Planet, Platoon, Ship } from "Supremacy/entities"
import { PLANET_POPULATION_LIMIT } from "Supremacy/consts"
import { simulatePlanets, simulatePlatoons, simulateShips } from "Supremacy/tick"
import { useSession } from "./hooks/session"

const speedMap = {
    slow: 2,
    paused: 0,
    normal: 1,
    fast: 0.5,
} as const

const useMultiplayerSync = () => {
    const { send, subscribe, unsubscribe } = usePeerConnection()
    const { host, multiplayer } = useSession()

    useEffect(() => {
        let peerMessageHandler

        if (multiplayer) {
            peerMessageHandler = (peer: unknown, { name, body }: any) => {}
        } else {
            peerMessageHandler = () => {}
        }

        subscribe(peerMessageHandler)

        return () => {
            unsubscribe(peerMessageHandler)
        }
    }, [multiplayer, subscribe, unsubscribe])

    const sync = useCallback(
        (changes: {
            date: number
            planets: Planet[]
            ships: Ship[]
            platoons: Platoon[]
        }) => {
            if (host && multiplayer) {
                send("update-world", { ...changes })
            }
        },
        [host, multiplayer, send],
    )

    return sync
}

function Simulation() {
    const sync = useMultiplayerSync()
    const [speed, setSpeed] = useAtom(simulationSpeedAtom)
    const tickTime = useMemo(() => 1000 * speedMap[speed], [speed])
    const timeout = useRef<number | undefined>(undefined)

    const tick = useAtomCallback(
        useCallback(
            (get: Getter, set: Setter) => {
                const date = get(dateAtom)
                const newDate = date + 1

                const originalPlanets = get(planetsAtom)
                let modifiedPlanets = originalPlanets
                const originalShips = get(shipsAtom)
                let modifiedShips = originalShips
                const originalPlatoons = get(platoonsAtom)
                let modifiedPlatoons = originalPlatoons

                // Platoons may effect planet ownership, so resolve first
                ;[modifiedPlatoons, modifiedPlanets] = simulatePlatoons(
                    modifiedPlatoons,
                    modifiedPlanets,
                    // newDate,
                )

                // Ships on the planet surface effect planet resources, so resolve second
                ;[modifiedShips, modifiedPlanets] = simulateShips(
                    modifiedShips,
                    modifiedPlanets,
                    // newDate,
                )

                // Finally resolve planets
                modifiedPlanets = simulatePlanets(
                    modifiedPlanets,
                    // newDate
                )

                // No op in single player
                sync({
                    date: newDate,
                    planets: modifiedPlanets,
                    ships: modifiedShips,
                    platoons: modifiedPlatoons,
                })

                // if (ai) {
                //     // The AI knows of the state of all planets, but should only know resources for it's own
                //     const filteredPlanets = modifiedPlanets.filter(() => true)
                //     // The AI knows about own ships, and enemy ships located in orbit or in the docking bays of owned planets
                //     const filteredShips = modifiedShips.filter(() => true)
                //     // The AI knows about own platoons and enemy platoons on it's planets
                //     const filteredPlatoons = modifiedPlatoons.filter(() => true)

                //     ai.process(filteredPlanets, filteredShips, filteredPlatoons)
                // }

                set(dateAtom, newDate)
                set(planetsAtom, modifiedPlanets)
                set(shipsAtom, modifiedShips)
                set(platoonsAtom, modifiedPlatoons)

                timeout.current = window.setTimeout(tick, tickTime)
            },
            [sync, tickTime],
        ),
    )

    useEffect(() => {
        timeout.current = window.setTimeout(tick, tickTime)

        return () => {
            if (timeout.current) {
                window.clearTimeout(timeout.current)
            }
        }
    }, [tickTime, tick, timeout])

    useEffect(() => {
        setSpeed("normal")
    }, [setSpeed])

    return null
}

export function GameSimulation() {
    const session = useAtomValue(sessionAtom)

    if (!session) {
        throw Error("Missing session data!")
    }

    return (
        <>
            {/* <Provider store={store}> */}
            <Simulation />
            <CommandProvider>
                <Outlet />
            </CommandProvider>
            {/* </Provider> */}
        </>
    )
}
