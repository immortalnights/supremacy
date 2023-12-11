import crypto from "crypto"
import { Server } from "socket.io"
import { IWorld } from "./serverTypes"
import {
    IGame,
    IGameOptions,
    GameStatus,
    IUpdate,
    IActionCallback,
    GameSpeed,
} from "./types"
import ConnectedPlayer from "./ConnectedPlayer"
import Player from "./Player"
import type { IUniverse } from "./simulation/types"
import AIPlayer from "./AIPlayer"

class Game<T extends IWorld> implements IGame {
    id: string
    // The players that are setup the game
    allocatedPlayers: string[]
    players: Player[]
    options: IGameOptions
    saved: number
    created: number
    status: GameStatus
    io: Server
    world: T
    speed: GameSpeed
    lastTick: number

    constructor(
        io: Server,
        options: IGameOptions,
        players: Player[],
        worldFactory: (options: IGameOptions) => T
    ) {
        this.id = crypto.randomUUID()
        this.allocatedPlayers = players.map((p) => p.id)
        this.options = options
        this.players = []
        this.saved = 0
        this.created = Date.now()
        this.status = GameStatus.Starting
        this.io = io
        this.world = worldFactory(options)
        this.speed = "normal"
        this.lastTick = 0
    }

    isEmpty() {
        this.players.length === 0
    }

    isFull() {
        return this.players.length === 2
    }

    canJoin(player: Player): boolean {
        return true // !!this.allocatedPlayers.find((pID) => pID === player.id)
    }

    start() {
        if (this.allocatedPlayers.length === this.players.length) {
            this.status = GameStatus.Playing
        }

        return this.status === GameStatus.Playing
    }

    join(player: Player) {
        console.log(`Player ${player.id} joining game ${this.id}`)

        let replacedPlayer: string | undefined
        const allocatedPlayer = this.allocatedPlayers.find(
            (pID) => pID === player.id
        )
        // If this isn't an allocated player; identify the missing player so that
        // the new player can take ownership
        if (!allocatedPlayer) {
            const index = this.allocatedPlayers.findIndex(
                (allocatedPlayerID) => {
                    return !this.players.find(
                        (activePlayer) => allocatedPlayerID === activePlayer.id
                    )
                }
            )

            if (index !== -1) {
                replacedPlayer = this.allocatedPlayers[index]
                // Replace the player in the allocatedPlayers list to handle future reconnection
                this.allocatedPlayers.splice(index, 1)
                this.allocatedPlayers.push(player.id)
            }
        }

        this.players.push(player)

        if (player instanceof ConnectedPlayer) {
            // Join the socket room
            player.socket.join(this.id)

            player.socket.emit("game-joined", {
                id: this.id,
                options: this.options,
                saved: this.saved,
                created: this.saved,
                players: this.players.map((player) => ({
                    id: player.id,
                    name: player.name,
                    ready: true,
                })),
                status: this.status,
                speed: this.speed,
            })

            this.world.join(player.id, false, replacedPlayer)

            const data = this.world.getStaticData()
            player.socket.emit("game-static-data", data)

            // Inform all other players in the game about the new player
            player.socket.to(this.id).emit("game-player-joined", {
                id: player.id,
                name: player.name,
                ready: true,
            })
            console.log(`Player ${player.id} joined game ${this.id}`)
        } else if (player instanceof AIPlayer) {
            this.world.join(player.id, true)
            console.log(`AIPlayer ${player.id} joined game ${this.id}`)
        }
    }

    leave(player: Player) {
        const index = this.players.findIndex((p) => p.id === player.id)

        console.assert(
            index !== -1,
            `Player ${player.id} is not in game ${this.id}`
        )

        if (index !== -1) {
            this.players.splice(index, 1)

            this.world.leave(player.id)

            if (player instanceof ConnectedPlayer) {
                // Leave the socket room
                player.socket.leave(this.id)
            }

            // Other player left, broadcast to everyone
            this.io.to(this.id).emit("game-player-left", {
                id: player.id,
            })
            console.log(`Player ${player.id} left game ${this.id}`)
        }
    }

    empty() {
        return (
            this.players.length === 0 ||
            this.players.every((p) => p instanceof AIPlayer)
        )
    }

    handlePlayerAction(
        player: Player,
        name: string,
        data: object,
        callback: IActionCallback
    ) {
        console.debug(`Player ${player.id} action ${name}`)
        const result = this.world.dispatch(name, player.id, data)
        callback(result.result, result.reason, result.data)
    }

    simulate() {
        switch (this.status) {
            case GameStatus.Playing: {
                const now = Date.now()

                // prevent the first delta being huge
                if (this.lastTick === 0) {
                    this.lastTick = now
                }

                this.world.simulate((now - this.lastTick) / 1000, this.speed)

                // Update the players
                this.players.forEach((player) => {
                    const data = this.world.updateFor(player.id) as IUniverse

                    // FIXME should not be done _in_ Game implementation
                    const update: IUpdate<IUniverse> = {
                        id: this.id,
                        saved: this.saved,
                        created: this.created,
                        world: data,
                    }

                    if (player instanceof ConnectedPlayer) {
                        player.socket.emit("game-update", update)
                    } else if (player instanceof AIPlayer) {
                        // TODO
                    }
                })

                this.lastTick = now
                break
            }
            case GameStatus.Starting:
            case GameStatus.Paused:
            case GameStatus.Finished:
            case GameStatus.Closed: {
                // No update sent
                break
            }
        }
    }
}

export default Game
