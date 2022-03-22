import crypto from "crypto"
import EventEmitter from "events"
import { Server } from "socket.io"
import { ServerEventEmitter, IWorld } from "./serverTypes"
import { IGame, IGameOptions, GameStatus, IPlayer } from "./types"
import Player from "./Player"

class Game<T extends IWorld> implements IGame {
  id: string
  // The players that are supposed to be in this game
  allocatedPlayers: string[]
  players: Player[]
  status: GameStatus
  io: Server
  events: ServerEventEmitter
  world: T
  lastTick: number

  constructor(io: Server, options: IGameOptions, players: Player[], worldFactory: (options: IGameOptions) => T)
  {
    this.id = crypto.randomUUID()
    this.allocatedPlayers = players.map((p) => p.id)
    this.players = []
    this.status = GameStatus.Starting
    this.io = io
    this.world = worldFactory(options)
    this.lastTick = 0
    this.events = new EventEmitter() as ServerEventEmitter
  }

  start()
  {
    if (this.allocatedPlayers.length === this.players.length)
    {
      this.status = GameStatus.Playing
    }

    return this.status === GameStatus.Playing
  }

  canJoin(player: Player): boolean
  {
    return !!this.allocatedPlayers.find((pID) => pID === player.id)
  }

  join(player: Player)
  {
    console.log(`Player ${player.id} joined game ${this.id}`)

    const allocatedPlayer = this.allocatedPlayers.find((pID) => pID === player.id)
    console.assert(allocatedPlayer, `Failed to find allocated player ${player.id} in game ${this.id}`)

    if (allocatedPlayer)
    {
      this.players.push(player)

      // Join the socket room
      player.socket.join(this.id)

      player.socket.emit("game-joined", {
        id: this.id,
        players: this.players.map((player) => ({
          id: player.id,
          name: player.name,
          ready: true,
        })),
        status: this.status,
      })

      this.world.join(player.id, false)

      // Inform all other players in the game about the new player
      player.socket.to(this.id).emit("game-player-joined", {
        id: player.id,
        name: player.name,
        ready: true,
      })
    }
  }

  leave(player: Player)
  {
    console.log(`Player ${player.id} left game ${this.id}`)

    const allocatedPlayer = this.allocatedPlayers.find((pID) => pID === player.id)
    console.assert(allocatedPlayer, `Failed to find allocated player ${player.id} in game ${this.id}`)

    if (allocatedPlayer)
    {
      const index = this.players.findIndex((p) => p.id === player.id)
      this.players.splice(index, 1)

      // Leave the socket room
      player.socket.leave(this.id)

      // Other player left, broadcast to everyone
      this.io.to(this.id).emit("game-player-left", {
        id: player.id
      })
    }
  }

  simulate()
  {
    switch (this.status)
    {
      case GameStatus.Playing:
      {
        const now = Date.now()

        this.world.simulate(now - this.lastTick)
        this.world.sendUpdates(this.players)

        this.lastTick = now
        break
      }
      case GameStatus.Starting:
      case GameStatus.Paused:
      case GameStatus.Finished:
      case GameStatus.Closed:
      {
        // No update sent
        break
      }
    }
  }
}

export default Game