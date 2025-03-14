import { Getter, Setter, useAtomValue, useSetAtom } from "jotai"
import { useAtomCallback } from "jotai/utils"
import { ReactNode, useCallback, useEffect, useMemo } from "react"
import { dateAtom, planetsAtom, platoonsAtom, sessionAtom, shipsAtom } from "../store"
import { usePeerConnection } from "webrtc-lobby-lib"
import { CommandContext } from "./CommandContext"
import {
    crewShip,
    decommissionShip,
    modifyCargo,
    modifyShipFuel,
    modifyShipPassengers,
    purchaseShip,
    toggleShip,
    transferShip,
    transitionShip,
    unloadShipCargo,
} from "Supremacy/ships"
import {
    modifyTroops,
    modifySuit,
    modifyWeapon,
    equip,
    loadPlatoon,
    unloadPlatoon,
} from "Supremacy/platoons"
import {
    applyModifyTax,
    applyRenamePlanet,
    modifyAggression,
    transferCreditsToCapital,
} from "Supremacy/planets"
import { useSetNotification } from "../components/Notification"
import { Platoon } from "Supremacy/entities"
import { useSession } from "Game/hooks/session"

const isPlatoon = (obj: unknown): obj is Platoon => {
    return Boolean(obj && typeof obj === "object" && "id" in obj)
}

// FIXME this needs to work for none mp!
export function CommandProvider({ children }: { children: ReactNode }) {
    const { send, subscribe, unsubscribe } = usePeerConnection()
    const { localPlayer, host } = useSession()
    const notify = useSetNotification()

    const exec = useAtomCallback(
        useCallback(
            (get: Getter, set: Setter, command: string, data: any) => {
                console.log("exec", command, data)

                const originalPlanets = get(planetsAtom)
                let modifiedPlanets = originalPlanets
                const originalShips = get(shipsAtom)
                let modifiedShips = originalShips
                const originalPlatoons = get(platoonsAtom)
                let modifiedPlatoons = originalPlatoons

                // How about
                // const data = {
                //     planets: get(planetsAtom),
                //     ships: get(shipsAtom),
                //     platoons: get(platoonsAtom),
                // }
                // const { modifiedPlanets, modifiedShips, modifiedPlanets } = callback[
                //     command
                // ](data, args)
                // if (modifiedPlanets) {
                //     set(planetsAtom, modifiedPlanets)
                // }

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
                } else if (command === "transfer-planet-credits") {
                    modifiedPlanets = transferCreditsToCapital(
                        localPlayer,
                        originalPlanets,
                        // notify,
                    )
                    set(planetsAtom, modifiedPlanets)
                } else if (command === "modify-planet-aggression") {
                    modifiedPlanets = modifyAggression(
                        localPlayer,
                        originalPlanets,
                        data.planet,
                        data.aggression,
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
                        "easy",
                        get(dateAtom),
                        notify,
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
                        data.position,
                    )
                    set(shipsAtom, modifiedShips)
                } else if (command === "transfer-ship") {
                    modifiedShips = transferShip(
                        localPlayer,
                        originalPlanets,
                        originalShips,
                        data.ship,
                        data.planet,
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
                } else if (command === "modify-platoon-suit") {
                    modifiedPlatoons = modifySuit(
                        localPlayer,
                        originalPlatoons,
                        data.platoon,
                        data.suit,
                    )
                    set(platoonsAtom, modifiedPlatoons)
                } else if (command === "modify-platoon-weapon") {
                    modifiedPlatoons = modifyWeapon(
                        localPlayer,
                        originalPlatoons,
                        data.platoon,
                        data.weapon,
                    )
                    set(platoonsAtom, modifiedPlatoons)
                } else if (command === "equip-platoon") {
                    ;[modifiedPlanets, modifiedPlatoons] = equip(
                        localPlayer,
                        originalPlanets,
                        originalPlatoons,
                        data.platoon,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(platoonsAtom, modifiedPlatoons)
                } else if (command === "load-platoon") {
                    modifiedPlatoons = loadPlatoon(
                        localPlayer,
                        originalPlatoons,
                        data.platoon,
                        data.ship,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(platoonsAtom, modifiedPlatoons)
                } else if (command === "unload-platoon") {
                    if ("platoon" in data && isPlatoon(data.platoon))
                        modifiedPlatoons = unloadPlatoon(
                            localPlayer,
                            originalPlatoons,
                            data.platoon,
                            data.planet,
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
            [host, send, localPlayer],
        ),
    )

    const update = useAtomCallback(
        useCallback((get: Getter, set: Setter, data: any) => {
            set(planetsAtom, data.planets)
            set(shipsAtom, data.ships)
            set(platoonsAtom, data.platoons)
        }, []),
    )

    useEffect(() => {
        const peerMessageHandler = (peer: unknown, { name, body }: any) => {
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

    return <CommandContext.Provider value={value}>{children}</CommandContext.Provider>
}
