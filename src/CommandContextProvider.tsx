import { Getter, Setter, useAtomValue } from "jotai"
import { useAtomCallback } from "jotai/utils"
import { ReactNode, useCallback, useEffect, useMemo } from "react"
import { planetsAtom, platoonsAtom, sessionAtom, shipsAtom } from "./Game/store"
import { usePeerConnection } from "webrtc-lobby-lib"
import { Planet } from "./Game/entities"
import { clamp } from "./Game/utilities"
import { CommandContext } from "./CommandContext"
import {
    crewShip,
    decommissionShip,
    modifyCargo,
    modifyShipFuel,
    modifyShipPassengers,
    purchaseShip,
    toggleShip,
    transitionShip,
    unloadShipCargo,
} from "./Game/shipCommands"
import { modifyTroops } from "./platoonCommands"

// FIXME move somewhere better
const applyRenamePlanet = (
    player: string,
    planets: Planet[],
    id: string,
    newName: string,
) => {
    const cpy = [...planets]

    const index = cpy.findIndex((p) => p.id === id)
    if (index !== -1) {
        const planet = cpy[index]
        if (planet.type !== "lifeless" && planet.owner === player) {
            console.log(
                `Renaming planet '${planet.name}' (${planet.id}) to '${newName}'`,
            )
            cpy[index] = { ...planet, name: newName }
        }
    }

    return cpy
}

const applyModifyTax = (
    player: string,
    planets: Planet[],
    id: string,
    newTax: number,
) => {
    const cpy = [...planets]
    const index = cpy.findIndex((p) => p.id === id)
    if (index !== -1) {
        const planet = cpy[index]

        if (planet.type !== "lifeless" && planet.owner === player) {
            const tax = clamp(newTax, 0, 100)
            console.log(
                `Setting planet '${planet.name}' (${planet.id}) tax to '${tax}'`,
            )
            cpy[index] = { ...planet, tax }
        }
    }

    return cpy
}

// FIXME this needs to work for none mp!
export function CommandProvider({ children }: { children: ReactNode }) {
    const { send, subscribe, unsubscribe } = usePeerConnection()
    const { localPlayer, host } = useAtomValue(sessionAtom)

    const exec = useAtomCallback(
        useCallback(
            (get: Getter, set: Setter, command: string, data: object) => {
                console.log("exec", command, data)

                const originalPlanets = get(planetsAtom)
                let modifiedPlanets = originalPlanets
                const originalShips = get(shipsAtom)
                let modifiedShips = originalShips
                const originalPlatoons = get(platoonsAtom)
                let modifiedPlatoons = originalPlatoons

                if (command === "rename-planet") {
                    // Apply the change locally
                    modifiedPlanets = applyRenamePlanet(
                        localPlayer,
                        originalPlanets,
                        data.planet,
                        data.newName,
                    )

                    set(planetsAtom, modifiedPlanets)
                } else if (command === "set-planet-tax") {
                    modifiedPlanets = applyModifyTax(
                        localPlayer,
                        originalPlanets,
                        data.planet,
                        data.newTax,
                    )
                    set(planetsAtom, modifiedPlanets)
                } else if (command === "purchase-ship") {
                    // Purchases are (currently) only made on the capital
                    ;[modifiedPlanets, modifiedShips] = purchaseShip(
                        localPlayer,
                        originalPlanets,
                        originalShips,
                        data.blueprint,
                        data.name,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(shipsAtom, modifiedShips)
                } else if (command === "crew-ship") {
                    ;[modifiedPlanets, modifiedShips] = crewShip(
                        localPlayer,
                        originalPlanets,
                        originalShips,
                        data.ship,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(shipsAtom, modifiedShips)
                } else if (command === "unload-ship") {
                    ;[modifiedPlanets, modifiedShips] = unloadShipCargo(
                        localPlayer,
                        originalPlanets,
                        originalShips,
                        data.ship,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(shipsAtom, modifiedShips)
                } else if (command === "decommission-ship") {
                    ;[modifiedPlanets, modifiedShips] = decommissionShip(
                        localPlayer,
                        originalPlanets,
                        originalShips,
                        data.ship,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(shipsAtom, modifiedShips)
                } else if (command === "modify-passengers") {
                    ;[modifiedPlanets, modifiedShips] = modifyShipPassengers(
                        localPlayer,
                        originalPlanets,
                        originalShips,
                        data.ship,
                        data.quantity,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(shipsAtom, modifiedShips)
                } else if (command === "modify-fuel") {
                    ;[modifiedPlanets, modifiedShips] = modifyShipFuel(
                        localPlayer,
                        originalPlanets,
                        originalShips,
                        data.ship,
                        data.quantity,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(shipsAtom, modifiedShips)
                } else if (command === "load-cargo") {
                    ;[modifiedPlanets, modifiedShips] = modifyCargo(
                        localPlayer,
                        originalPlanets,
                        originalShips,
                        data.ship,
                        data.cargo,
                        data.quantity,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(shipsAtom, modifiedShips)
                } else if (command === "unload-cargo") {
                    ;[modifiedPlanets, modifiedShips] = modifyCargo(
                        localPlayer,
                        originalPlanets,
                        originalShips,
                        data.ship,
                        data.cargo,
                        data.quantity,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(shipsAtom, modifiedShips)
                } else if (command === "transition-ship") {
                    modifiedShips = transitionShip(
                        localPlayer,
                        originalPlanets,
                        originalShips,
                        data.ship,
                        data.planet,
                        data.position,
                    )
                    set(shipsAtom, modifiedShips)
                } else if (command === "toggle-ship") {
                    modifiedShips = toggleShip(
                        localPlayer,
                        originalPlanets,
                        originalShips,
                        data.ship,
                        data.enabled,
                    )
                    set(shipsAtom, modifiedShips)
                } else if (command === "modify-platoon-troops") {
                    ;[modifiedPlanets, modifiedPlatoons] = modifyTroops(
                        localPlayer,
                        originalPlanets,
                        originalPlatoons,
                        data.platoon,
                        data.quantity,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(platoonsAtom, modifiedPlatoons)
                } else {
                    console.error(`Unknown command '${command}'`)
                }

                if (host) {
                    console.log("host send update-world")
                    send("update-world", {
                        planets: modifiedPlanets,
                        ships: modifiedShips,
                        platoons: modifiedPlatoons,
                    })
                } else {
                    console.log("none-host send player-action")
                    send("player-action", {
                        command,
                        data,
                    })
                }
            },
            [host, send],
        ),
    )

    const update = useAtomCallback(
        useCallback((get: Getter, set: Setter, data: object) => {
            set(planetsAtom, data.planets)
            set(shipsAtom, data.ships)
            set(platoonsAtom, data.platoons)
        }, []),
    )

    useEffect(() => {
        const peerMessageHandler = (peer, { name, body }) => {
            console.log(`${host ? "Host" : "Player"} received`, name, body)
            // Action from none host player
            if (name === "player-action") {
                exec(body.command, body.data)
            } else if (name === "update-world") {
                update(body)
            }
        }

        subscribe(peerMessageHandler)

        return () => {
            unsubscribe(peerMessageHandler)
        }
    }, [host, exec, update, send, subscribe, unsubscribe])

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
