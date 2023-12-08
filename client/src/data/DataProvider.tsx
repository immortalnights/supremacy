import React from "react"
import Recoil, { TransactionInterface_UNSTABLE } from "recoil"
import IOProvider from "./IOContext"
import {
    IPlayer,
    IRoom,
    RoomStatus,
    IGameOptions,
    IGame,
    IUpdate,
} from "@server/types"
import { Player } from "./Player"
import { Room, AvailableRooms } from "./Room"
import { StaticShips, StaticEquipment } from "./StaticData"
import { Game } from "./Game"
import { SelectedPlanetID } from "./General"
import { SolarSystem } from "./SolarSystem"
import { Planets } from "./Planets"
import { Ships } from "./Ships"
import { Platoons } from "./Platoons"
import { EspionageReport } from "./Espionage"
import type { IUniverse } from "../simulation/types.d"

// TODO reorganize so that Lobby/Room related data is handled separately from the Game

const handleRegistered = (
    { id }: { id: string },
    { get, set }: TransactionInterface_UNSTABLE
) => {
    const player = { ...get(Player), id }
    set(Player, player)
}

// Consider reversing the arguments so that received data does not have to be bundled into as single object
// (callback: TransactionInterface_UNSTABLE, ...args: any[]) => void
type TransactionHandler = (
    data: any,
    callback: TransactionInterface_UNSTABLE
) => void

const handleSubscriptionPost: TransactionHandler = (
    { key, action, data }: { key: string; action: string; data: object },
    { get, set, reset }
) => {
    console.debug("Subscription Post", key, action, data)
    switch (key) {
        case "rooms": {
            const room = data as IRoom

            switch (action) {
                case "add": {
                    const rooms = get(AvailableRooms)
                    set(AvailableRooms, [...rooms, room])
                    break
                }
                case "remove": {
                    const rooms = get(AvailableRooms)
                    const index = rooms.findIndex((r) => r.id === room.id)
                    if (index !== -1) {
                        const copy = [...rooms]
                        copy.splice(index, 1)
                        set(AvailableRooms, copy)
                    }
                    break
                }
                default: {
                    console.error(
                        `Unexpected subscription message ${key} / ${action}`
                    )
                    break
                }
            }
            break
        }
        default: {
            console.error(`Unexpected subscription message ${key} / ${action}`)
            break
        }
    }
}

const handleRoomJoined: TransactionHandler = (data: IRoom, { get, set }) => {
    const player = get(Player)

    set(Player, { ...player, ready: false })

    // Set the room data
    set(Room, data)
}

const handleRoomLeave: TransactionHandler = (
    data: any,
    { get, set, reset }
) => {
    const player = get(Player)

    set(Player, { ...player, ready: false })

    reset(Room)
}

// FIXME can be optimized/tidied as a room update message
const handleRoomPlayerJoined: TransactionHandler = (
    player: IPlayer,
    { get, set }
) => {
    const room = get(Room)
    console.log("new player joined room", room?.id)

    if (room) {
        const existingPlayer = room.players.find((p) => p.id === player.id)
        if (!existingPlayer) {
            set(Room, { ...room, players: [...room.players, player] })
        }
    }
}

// FIXME can be optimized/tidied as a room update message
const handleRoomPlayerLeft: TransactionHandler = (
    { id }: { id: string },
    { get, set, reset }
) => {
    const player = get(Player)
    const room = get(Room)

    if (id === player.id) {
        console.debug("Self left room", room?.id)
        reset(Room)
    } else if (room) {
        console.log(id, "left room", room?.id)
        const index = room.players.findIndex((p) => p.id === id)
        if (index !== -1) {
            const players = [...room.players]
            players.splice(index, 1)
            set(Room, { ...room, players })
        }
    }
}

interface RoomUpdateArgs {
    id: string
    status: RoomStatus
    countdown: number
    options: IGameOptions
}

const handleRoomUpdate: TransactionHandler = (
    { id, status, countdown, options }: RoomUpdateArgs,
    { get, set }
) => {
    const room = get(Room)

    console.log("handle room update")

    if (room) {
        // replace options with new options
        console.assert(
            room.id === id,
            "Current room does not match ID of received update"
        )
        set(Room, { ...room, status, countdown, options })
    } else {
        console.warn("Received room update when no longer in a room")
    }
}

// FIXME can be optimized/tidied as a room update message
const handlePlayerChanged: TransactionHandler = (
    { id, name, ready }: { id: string; name: string; ready: boolean },
    { get, set }
) => {
    const room = get(Room)
    const player = get(Player)

    if (room) {
        if (id === player.id) {
            set(Player, { ...player, name, ready })
        }

        const index = room.players.findIndex((p) => p.id === id)
        if (index !== -1) {
            const players = [...room.players]
            players[index] = { ...players[index], name, ready }
            set(Room, { ...room, players })
        }
    }
}

const handleGameCreated: TransactionHandler = (data: IGame, callback) => {
    // FIXME dislike how this doesn't have parity with Room creation/joining
    // but there is no direct user interaction that creates a game that can
    // handle the response to navigate the user to the game.
    handleGameJoined(data, callback)
}

const handleGameJoined: TransactionHandler = (
    data: IGame,
    { get, set, reset }
) => {
    const player = get(Player)

    set(Player, { ...player, ready: false })

    // Reset lobby data
    reset(Room)

    // Reset any lingering game data
    reset(SolarSystem)
    reset(Planets)
    reset(Ships)
    reset(Platoons)
    reset(SelectedPlanetID)
    reset(EspionageReport)

    set(Game, data)
}

const handleGamePlayerJoined: TransactionHandler = (
    player: IPlayer,
    { get, set }
) => {
    const game = get(Game) as IGame

    const existingPlayer = game.players.find((p) => p.id === player.id)
    if (!existingPlayer) {
        set(Game, { ...game, players: [...game.players, player] })
    }
}

const handleGamePlayerKicked: TransactionHandler = ({}: {}, { reset }) => {
    reset(Game)
    reset(SolarSystem)
    reset(Planets)
    reset(Ships)
    reset(Platoons)
    reset(SelectedPlanetID)
    reset(EspionageReport)
}

const handleStaticGameData: TransactionHandler = (data: any, { get, set }) => {
    set(StaticShips, data.ships)
    set(StaticEquipment, data.equipment)
    // set(StaticEspionage, data.espionage)
}

const handleGameUpdate: TransactionHandler = (
    data: IUpdate<IUniverse>,
    { get, set }
) => {
    // Apply the game data to the different atoms;

    const { planets, ships, platoons, ...solarSystem } = data.world

    // FIXME do this somewhere better
    let selected = get(SelectedPlanetID)
    if (selected === -1) {
        const player = get(Player)
        console.warn(
            player.id,
            planets[0].owner,
            planets[planets.length - 1].owner
        )
        if (planets[0].owner === player.id) {
            selected = planets[0].id
        } else if (planets[planets.length - 1].owner === player.id) {
            selected = planets[planets.length - 1].id
        } else {
            // Find the first from 0 to x, would be better if the search was
            // based on the assumed players' capital
            const firstOwned = planets.find(
                (planet) => planet.owner === player.id
            )
            selected = firstOwned?.id || 0
        }

        set(SelectedPlanetID, selected)
    }

    set(SolarSystem, solarSystem)
    set(Planets, planets)
    set(Ships, ships)
    set(Platoons, platoons)
}

const handlePartialGameUpdate: TransactionHandler = (
    data: IUpdate<IUniverse>,
    { get, set }
) => {
    const { planets, ships, platoons, espionage, ...solarSystem } = data.world

    if (planets) {
        // Copy the main planets array
        const existingPlanets = [...get(Planets)]

        planets.forEach((planet) => {
            const index = existingPlanets.findIndex((p) => p.id === planet.id)
            console.assert(index >= 0, "Invalid planet index", index)
            existingPlanets[index] = planet
        })

        set(Planets, existingPlanets)
    }

    if (ships) {
        const existingShips = [...get(Ships)]

        ships.forEach((ship) => {
            const index = existingShips.findIndex((s) => s.id === ship.id)
            if (index === -1) {
                existingShips.push(ship)
            } else {
                existingShips[index] = ship
            }
        })

        set(Ships, existingShips)
    }

    if (platoons) {
        const existingPlatoons = [...get(Platoons)]

        platoons.forEach((platoon) => {
            const index = existingPlatoons.findIndex((s) => s.id === platoon.id)
            if (index === -1) {
                existingPlatoons.push(platoon)
            } else {
                existingPlatoons[index] = platoon
            }
        })

        set(Platoons, existingPlatoons)
    }

    if (espionage) {
        set(EspionageReport, espionage)
    }

    // TODO rest
}

interface IMessageHandlerMap {
    [key: string]: TransactionHandler
}

const MessageHandlerMap: IMessageHandlerMap = {
    registered: handleRegistered,
    "subscription-post": handleSubscriptionPost,
    // FIXME merge joined and player joined?
    "room-joined": handleRoomJoined,
    "room-leave": handleRoomLeave,
    // Another player joined the room
    "room-player-joined": handleRoomPlayerJoined,
    // Another player left the room
    "room-player-left": handleRoomPlayerLeft,
    //
    "room-update": handleRoomUpdate,
    // Replace with room-update?
    "player-changed": handlePlayerChanged,
    "game-created": handleGameCreated,
    "game-joined": handleGameJoined,
    "game-player-joined": handleGamePlayerJoined,
    // "game-player-left": handleGamePlayerLeft,
    "game-player-kicked": handleGamePlayerKicked,
    "game-static-data": handleStaticGameData,
    "game-update": handleGameUpdate,
    "partial-game-update": handlePartialGameUpdate,
}

// Binds the Socket and Recoil data together using RecoilTransaction
const SocketToRecoil = ({ children }: { children: React.ReactNode }) => {
    const handleMessage = Recoil.useRecoilTransaction_UNSTABLE(
        (callback) =>
            (action: string, data: any = {}) => {
                // console.log("received", action, data)

                if (action === "disconnect") {
                    console.log("Disconnected!")
                    callback.reset(Player)
                    callback.reset(Room)
                    callback.reset(Game)
                    callback.reset(SolarSystem)
                    callback.reset(SelectedPlanetID)
                    callback.reset(EspionageReport)
                } else if (MessageHandlerMap[action]) {
                    MessageHandlerMap[action](data, callback)
                } else {
                    console.error(
                        `Message '${action}' is not handled in Data Provider`
                    )
                }
            }
    )

    return <IOProvider handleMessage={handleMessage}>{children}</IOProvider>
}

const DataProvider = ({ children }: { children: React.ReactNode }) => {
    console.log("Render DataProvider")

    return (
        <Recoil.RecoilRoot initializeState={() => {}}>
            <SocketToRecoil>{children}</SocketToRecoil>
        </Recoil.RecoilRoot>
    )
}

export default DataProvider
