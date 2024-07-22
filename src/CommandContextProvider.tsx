import { Getter, Setter, useAtomValue } from "jotai"
import { useAtomCallback } from "jotai/utils"
import {
    ReactNode,
    createContext,
    useCallback,
    useEffect,
    useMemo,
} from "react"
import { planetsAtom, platoonsAtom, sessionAtom, shipsAtom } from "./Game/store"
import { useManager, usePeerConnection } from "webrtc-lobby-lib"
import { Planet, Ship } from "./Game/entities"
import { clamp } from "./Game/utilities"
import {
    canAffordShip,
    commissionShip,
    deductShipCost,
} from "./Game/Shipyard/utilities"
import { CommandContext } from "./CommandContext"

// FIXME move somewhere better
const applyRenamePlanet = (planets: Planet[], id: string, newName: string) => {
    const cpy = [...planets]

    const index = cpy.findIndex((p) => p.id === id)
    if (index !== -1) {
        const originalPlanet = cpy[index]
        console.log(
            `Renaming planet '${originalPlanet.name}' (${originalPlanet.id}) to '${newName}'`,
        )
        cpy[index] = { ...originalPlanet, name: newName }
    }

    return cpy
}

const applyModifyTax = (planets: Planet[], id: string, newTax: number) => {
    const cpy = [...planets]
    const index = cpy.findIndex((p) => p.id === id)
    if (index !== -1) {
        const planet = cpy[index]

        if (planet.type !== "lifeless") {
            const modifiedPlanet = { ...planet }
            const tax = clamp(newTax, 0, 100)
            console.log(
                `Setting planet '${modifiedPlanet.name}' (${modifiedPlanet.id}) tax to '${tax}'`,
            )
            cpy[index] = { ...modifiedPlanet, tax }
        }
    }

    return cpy
}

const purchaseShip = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    type: string,
    name: string,
) => {
    let modifiedPlanets
    let modifiedShips
    // for now, purchases always get applied to the players capital, regardless of the selected planet
    const index = planets.findIndex(
        (p) => p.type !== "lifeless" && p.capital && p.owner === player,
    )

    if (index !== -1) {
        const currentPlanet = planets[index]
        // Count ships in planet docking bay
        const dockedShips = ships.filter(
            (s) =>
                s.location.planet === currentPlanet.id &&
                s.location.position === "docked",
        )

        if (currentPlanet.type === "lifeless") {
            console.error("Cannot purchase ships on a lifeless planet")
            // } else if (!currentPlanet.capital) {
            //     console.error("Cannot purchase ships from none capital planet")
        } else if (dockedShips.length >= 3) {
        } else if (!canAffordShip(currentPlanet, type)) {
            console.log("Cannot afford ship")
        } else {
            const ownedShips = ships.filter(
                (ship) => ship.owner === currentPlanet.owner,
            ).length
            // Ships in docking bay (at capital)

            if (ownedShips > 32) {
                console.error(
                    `Player ${currentPlanet.owner} cannot own more than 32 ships`,
                )
            } else {
                modifiedPlanets = [...planets]

                const modifiedPlanet = deductShipCost(currentPlanet, type)
                modifiedPlanets[index] = { ...modifiedPlanet }

                const newShip = commissionShip(type, name, modifiedPlanet.owner)
                modifiedShips = [...ships, newShip]
            }
        }
    }

    return [modifiedPlanets ?? planets, modifiedShips ?? ships] as const
}

// FIXME this needs to work for none mp!
export function CommandProvider({ children }: { children: ReactNode }) {
    const { player: localPlayer } = useManager()
    const { send, subscribe, unsubscribe } = usePeerConnection()
    const { host } = useAtomValue(sessionAtom)

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
                        originalPlanets,
                        data.planet,
                        data.newName,
                    )

                    set(planetsAtom, modifiedPlanets)
                } else if (command === "set-planet-tax") {
                    modifiedPlanets = applyModifyTax(
                        originalPlanets,
                        data.planet,
                        data.newTax,
                    )
                    set(planetsAtom, modifiedPlanets)
                } else if (command === "purchase-ship") {
                    // Purchases are (currently) only made on the capital
                    ;[modifiedPlanets, modifiedShips] = purchaseShip(
                        localPlayer.id,
                        originalPlanets,
                        originalShips,
                        data.type,
                        data.name,
                    )
                    set(planetsAtom, modifiedPlanets)
                    set(shipsAtom, modifiedShips)
                } else {
                    console.error("Unknown command")
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
