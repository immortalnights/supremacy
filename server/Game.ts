import crypto from "crypto"
import EventEmitter from "events"
import { Server } from "socket.io"
import { ServerEventEmitter, IWorld } from "./serverTypes"
import { IGame, IGameOptions, GameStatus, IPlayer, IUpdate } from "./types"
import Player from "./Player"
import type { IUniverse } from "./simulation/types"

class Game<T extends IWorld> implements IGame {
  id: string
  // The players that are supposed to be in this game
  allocatedPlayers: string[]
  players: Player[]
  options: IGameOptions
  saved: number
  created: number
  status: GameStatus
  io: Server
  events: ServerEventEmitter
  world: T
  lastTick: number

  constructor(io: Server, options: IGameOptions, players: Player[], worldFactory: (options: IGameOptions) => T)
  {
    this.id = crypto.randomUUID()
    this.allocatedPlayers = players.map((p) => p.id)
    this.options = options
    this.players = []
    this.saved = 0
    this.created = Date.now()
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
    return this.players.length < 2 // !!this.allocatedPlayers.find((pID) => pID === player.id)
  }

  join(player: Player)
  {
    console.log(`Player ${player.id} joined game ${this.id}`)

    const allocatedPlayer = this.allocatedPlayers.find((pID) => pID === player.id)
    // If this isn't an allocated player; identify the missing place and transfer all items to the new player
    if (!allocatedPlayer)
    {
      const missingPlayer = this.allocatedPlayers.find((allocatedPlayerID) => {
        return !this.players.find((activePlayer) => allocatedPlayerID === activePlayer.id)
      })

      if (missingPlayer)
      {
        this.world.transferOwnership(missingPlayer, player.id)
      }
    }

    // if (allocatedPlayer)
    {
      this.players.push(player)

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
      })

      this.world.join(player.id, false)

      const data = this.world.getStaticData()
      player.socket.emit("game-static-data", data)

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

    const index = this.players.findIndex((p) => p.id === player.id)

    if (index !== -1)
    {
      this.players.splice(index, 1)

      // Leave the socket room
      player.socket.leave(this.id)

      // Other player left, broadcast to everyone
      this.io.to(this.id).emit("game-player-left", {
        id: player.id
      })
    }
    else
    {
      console.warn(`Player ${player.id} is not in game ${this.id}`)
    }
  }

  simulate()
  {
    switch (this.status)
    {
      case GameStatus.Playing:
      {
        const now = Date.now()

        // prevent the first delta being huge
        if (this.lastTick === 0)
        {
          this.lastTick = now
        }

        this.world.simulate((now - this.lastTick) / 1000)
        this.players.forEach((player) => {
          const data = this.world.updateFor(player.id) as IUniverse

          // FIXME should not be done _in_ Game implementation
          const update: IUpdate<IUniverse> = {
            id: this.id,
            saved: this.saved,
            created: this.created,
            world: data,
          }

          player.socket.emit("game-update", update)
        })

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