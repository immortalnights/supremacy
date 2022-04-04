import crypto from "crypto"
import EventEmitter from "events"
import { Server } from "socket.io"
import { ServerEventEmitter } from "../serverTypes"
import { IRoom, RoomStatus, IGameOptions, IActionCallback, IPlayer } from "../types"
import Player from "../Player"
import ConnectedPlayer from "../ConnectedPlayer"
import AIPlayer from "../AIPlayer"

const randomSeedString = (length: number = 6) => {
  return (Math.random() + 1).toString(36).substring(length);
}

const ROOM_START_COUNTDOWN = 3
const MINIMUM_REQUIRED_PLAYERS = 2

class Room implements IRoom {
  id: string
  options: IGameOptions
  host: string
  slots: number
  players: Player[]
  status: RoomStatus
  io: Server
  events: ServerEventEmitter
  countdown: number
  countdownTimer?: NodeJS.Timer

  constructor(io: Server, host: ConnectedPlayer)
  {
    this.id = crypto.randomUUID()
    this.options = {
      seed: randomSeedString(),
    }
    this.host = ""
    this.slots = 2
    this.players = []
    this.status = RoomStatus.Setup
    this.io = io
    this.events = new EventEmitter() as ServerEventEmitter
    this.countdown = 10,
    this.countdownTimer = undefined

    this.hostJoined(host)
  }

  toJSON()
  {
    return {
      id: this.id,
      host: this.host,
      options: this.options,
      slots: this.slots,
      players: this.players.map((player) => {
        const { id, name, ready } = player
        return {
          id,
          name,
          ready,
        }
      }),
      status: this.status,
      countdown: 0,
    }
  }

  hostJoined(player: ConnectedPlayer)
  {
    this.host = player.id
    this.players.push(player)

    // Join the socket room
    player.socket.join(this.id)

    this.sendRoomDetailsTo(player)
  }

  join(player: ConnectedPlayer)
  {
    this.players.push(player)

    // Join the socket room
    player.socket.join(this.id)

    // Inform the new player about the room
    this.sendRoomDetailsTo(player)

    // Inform all other players in the room about the new player
    player.socket.to(this.id).emit("room-player-joined", {
      id: player.id,
      name: player.name,
      ready: false,
    })

    // Unset ready state on all connected players
    this.players.forEach((other) => {
      if (other instanceof ConnectedPlayer)
      {
        other.ready = false

        this.io.to(this.id).emit("player-changed", {
          id: other.id,
          name: other.name,
          ready: other.ready,
        })
      }
    })
  }

  joinAI(player: AIPlayer)
  {
    this.players.push(player)

    // AI is always ready
    player.ready = true

    // FIXME deduplicate from ::join
    // Inform all other players in the room about the new player
    this.io.to(this.id).emit("room-player-joined", {
      id: player.id,
      name: player.name,
      ready: player.ready,
    })

    // Unset ready state on all players
    this.players.forEach((other) => {
      if (other instanceof ConnectedPlayer)
      {
        other.ready = false

        this.io.to(this.id).emit("player-changed", {
          id: other.id,
          name: other.name,
          ready: other.ready,
        })
      }
    })
  }

  leave(player: ConnectedPlayer)
  {
    // Remove the player from the socket room
    player.socket.leave(this.id)

    if (this.host === player.id)
    {
      console.log(`The host has left the room ${this.id}`)

      // Remove the host from the player list, so they don't get kicked
      const index = this.players.findIndex((p) => p.id === player.id)
      this.players.splice(index, 1)

      // If the host left, kick the other players
      this.players.forEach((player) => {
        if (player instanceof ConnectedPlayer)
        {
          (player as ConnectedPlayer).socket.emit("room-player-kicked")
        }
      })

      // Remove all players from the room
      this.players = []
      this.status = RoomStatus.Closed
    }
    else
    {
      console.log(`A player has left the room ${this.id}`)

      const index = this.players.findIndex((p) => p.id === player.id)
      this.players.splice(index, 1)

      // Other player left, broadcast to everyone
      this.io.to(this.id).emit("room-player-left", {
        id: player.id
      })

      // Unset ready state on all remaining players
      this.players.forEach((other) => {
        if (other instanceof ConnectedPlayer)
        {
          other.ready = false

          this.io.to(this.id).emit("player-changed", {
            id: other.id,
            name: other.name,
            ready: other.ready,
          })
        }
      })
    }

    this.handleReadyStateChanged()
  }

  handlePlayerAction(player: Player, name: string, data: any, callback: IActionCallback)
  {
    const result = {
      result: false,
      message: "",
      data: {}
    }

    switch (name)
    {
      case "change-room-name":
      {
        break
      }
      case "change-seed":
      {
        break
      }
      case "add-ai-player":
      {
        const p = new AIPlayer()
        this.joinAI(p)

        result.result = true
        break
      }
    }

    callback(result.result, result.message, result.data)
  }

  onPlayerChanged(player: Player)
  {
    this.io.to(this.id).emit("player-changed", {
      id: player.id,
      name: player.name,
      ready: player.ready,
    })

    this.handleReadyStateChanged()
  }

  onTogglePlayerReady(player: Player)
  {
    // console.log(`Broadcast ready state change ${this.id}, ${player.id}, ${player.ready}`)
    // Broadcast to all players (including the one that made the request)
    this.io.to(this.id).emit("player-changed", {
      id: player.id,
      name: player.name,
      ready: player.ready,
    })

    this.handleReadyStateChanged()
  }

  sendRoomDetailsTo(to: ConnectedPlayer)
  {
    // Inform the player about the room
    to.socket.emit("room-joined", this.toJSON())
  }

  sendRoomUpdate()
  {
    console.log(`Send room ${this.id} update`)
    this.io.to(this.id).emit("room-update", {
      id: this.id,
      status: this.status,
      countdown: this.countdown,
      options: this.options,
    })
  }

  isReady()
  {
    return (this.players.length === MINIMUM_REQUIRED_PLAYERS && this.players.every((p) => p.ready))
  }

  cancelCountdown(status: RoomStatus)
  {
    this.status = status
    // Type cast is required as setInterval returns a NodeJS.Timer...
    clearInterval(this.countdownTimer as NodeJS.Timeout)
    this.countdownTimer = undefined
    this.countdown = 0
  }

  handleReadyStateChanged()
  {
    // If all players are ready, begin the countdown (minimum player count should not be fixed)
    if (this.isReady())
    {
      console.log(`All players are ready in room ${this.id}, begin countdown`)

      const doCountdown = () => {
        this.countdown -= 1

        if (false === this.isReady())
        {
          console.log(`Start countdown cancelled for room ${this.id}`)
          this.cancelCountdown(RoomStatus.Setup)
        }
        else if (0 === this.countdown)
        {
          console.log(`Start countdown complete for room ${this.id}`)
          // Type cast is required as setInterval returns a NodeJS.Timer...
          this.cancelCountdown(RoomStatus.Closed)
          this.events.emit("create-game", { ...this.options }, [ ...this.players ])
        }

        this.sendRoomUpdate()
      }

      // Start the countdown at ten
      this.countdown = ROOM_START_COUNTDOWN
      this.status = RoomStatus.Starting
      this.countdownTimer = setInterval(doCountdown, 1000)

      // Send the initial countdown time
      this.sendRoomUpdate()
    }
    // Not everyone is ready, cancel the countdown
    else if (this.status === RoomStatus.Starting)
    {
      console.log(`Start countdown cancelled for room ${this.id}`)
      this.cancelCountdown(RoomStatus.Setup)
      this.sendRoomUpdate()
    }
  }

  empty(): boolean
  {
    return this.players.length === 0 || this.players.every((player) => player instanceof AIPlayer)
  }
}

export default Room