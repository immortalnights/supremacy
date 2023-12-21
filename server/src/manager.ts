import Player from "./Player"
import ConnectedPlayer from "./ConnectedPlayer"
import Room from "./lobby/Room"
import Game from "./Game"
import type {
    ClientToServerEvents,
    IGameOptions,
    ServerToClientEvents,
} from "./types"
import Universe from "./simulation/Universe"
import AIPlayer from "./AIPlayer"
import { Server } from "socket.io"

// TODO tidy socket message handling up based on https://socket.io/docs/v4/server-application-structure/
export type SubscriptionType = "rooms"

interface Subscription {
    player: ConnectedPlayer
    type: SubscriptionType
}

class SubscriptionManager {
    subscriptions: Subscription[]

    constructor() {
        this.subscriptions = []

        // setInterval(() => {
        //   console.debug(`${this.subscriptions.length} Subscriptions`)
        // }, 1000)
    }

    subscribe(player: ConnectedPlayer, key: SubscriptionType): boolean {
        console.debug(`Player ${player.id} subscribing to ${key}`)
        let ok = false

        const type = key as SubscriptionType
        switch (type) {
            case "rooms": {
                this.subscriptions.push({
                    player,
                    type,
                })

                ok = true
                break
            }
            default: {
                console.error("Invalid subscription type")
                break
            }
        }

        return ok
    }

    unsubscribe(player: ConnectedPlayer, key?: SubscriptionType) {
        console.debug(`Player ${player.id} unsubscribing from ${key}`)

        if (key === undefined) {
            let index
            do {
                index = this.subscriptions.findIndex(
                    (item) => item.player === player
                )
                if (index !== -1) {
                    this.subscriptions.splice(index, 1)
                }
            } while (index !== -1)
        } else {
            const index = this.subscriptions.findIndex(
                (item) => item.player.id === player.id && item.type === key
            )
            if (index !== -1) {
                this.subscriptions.splice(index, 1)
            }
        }
    }

    notify(key: SubscriptionType, action: string, data: object) {
        this.subscriptions.forEach((item) => {
            if (item.type === key) {
                item.player.socket.emit(`subscription-post`, {
                    key,
                    action,
                    data,
                })
            }
        })
    }
}

class Manager {
    players: ConnectedPlayer[]
    rooms: Room[]
    games: Game<Universe>[]
    subscriptions: SubscriptionManager

    constructor() {
        this.players = []
        this.rooms = []
        this.games = []
        this.subscriptions = new SubscriptionManager()
    }
}

export const manager = new Manager()

const DEV_DELAY = true
export const devDelay = (callback: () => void, delay: number) => {
    if (DEV_DELAY) {
        console.log(`DEV: will send response in ${delay / 1000}s`)
    }

    setTimeout(
        () => {
            callback()
        },
        DEV_DELAY ? delay : 0
    )
}

export const cleanupRoom = (room: Room) => {
    if (room.isEmpty()) {
        const index = manager.rooms.indexOf(room)
        if (index !== -1) {
            const removed = manager.rooms.splice(index, 1)[0]
            console.info(`Room ${removed.id} deleted`)

            manager.subscriptions.notify("rooms", "remove", removed)
        }
    } else {
        console.debug(`Room ${room.id} is no longer empty, did not delete`)
    }
}

export const cleanupGame = (game: Game<Universe>) => {
    if (game.empty()) {
        const index = manager.games.indexOf(game)
        if (index !== -1) {
            const removed = manager.games.splice(index, 1)[0]
            console.info(`Game ${removed.id} deleted`)
        }
    } else {
        console.debug(`Game ${game.id} is no longer empty, did not delete`)
    }
}

export const handleCreateGame = (
    io: Server<ClientToServerEvents, ServerToClientEvents>,
    options: IGameOptions,
    players: Player[]
) => {
    console.log(`Creating new game for ${players.map((p) => p.id).join(", ")}`)
    const game = new Game<Universe>(
        io,
        options,
        players,
        (_opts: IGameOptions) => {
            const u = new Universe()
            u.generate(0) // (opts.seed)

            return u
        }
    )

    manager.games.push(game)

    // Join any AI players
    players.forEach((player) => {
        if (player instanceof AIPlayer) {
            void game.join(player)
        }
    })

    // Notify the players of the game, so they can join it
    players.forEach((player) => {
        if (player instanceof ConnectedPlayer) {
            devDelay(() => {
                console.log(`Sending game ${game.id} to ${player.id}`)
                player.socket.emit("game-created", {
                    id: game.id,
                    options: game.options,
                    saved: game.saved,
                    created: game.created,
                    players: game.allocatedPlayers.map(() => ({
                        id: player.id,
                        name: player.name,
                        ready: player.ready,
                    })),
                    status: game.status,
                    speed: game.speed,
                })
            }, 1000)
        }
    })
}

// simulation
setInterval(() => {
    manager.games.forEach((game) => {
        game.simulate()
    })
}, 250)

// debug output

setInterval(() => {
    console.log(
        `${manager.players.length} players connected, ${manager.rooms.length} rooms, ${manager.games.length} games`
    )

    manager.rooms.forEach((room) => {
        console.log(`  Room ${room.id} has ${room.players.length} players`)
    })

    manager.games.forEach((game) => {
        console.log(
            `  Game ${game.id} has ${game.allocatedPlayers.length} players (${game.players.length} ready)`
        )
    })
}, 5000)
