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

    this.join(host)
  }

  isEmpty(): boolean
  {
    return this.players.length === 0 || this.players.every((player) => player instanceof AIPlayer)
  }

  isFull(): boolean
  {
    return this.players.length === this.slots
  }

  isReady(): boolean
  {
    return (this.players.length === MINIMUM_REQUIRED_PLAYERS && this.players.every((p) => p.ready))
  }

  canJoin()
  {
    return this.status === RoomStatus.Setup
  }

  toJSON(): IRoom
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

  join(player: ConnectedPlayer): void
  {
    if (player.room)
    {
      console.log(`Player ${player.id} is already in room ${player.room?.id}`)
    }
    else if (!!this.players.find((p) => p.id === player.id))
    {
      console.log(`Player ${player.id} is already in this room ${this.id}`)
    }
    else
    {
      // Join the room
      this.players.push(player)

      // Join the socket room
      player.socket.join(this.id)

      // Promote the new player to host, if a host does not exist
      if (this.host === "")
      {
        this.host = player.id
      }

      // Inform all other players in the room about the new player
      player.socket.to(this.id).emit("room-player-joined", {
        id: player.id,
        name: player.name,
        ready: false,
      })

      // Unset ready state on all connected players
      this.players.forEach((other) => {
        if (other !== player && other instanceof ConnectedPlayer)
        {
          other.ready = false

          this.io.to(this.id).emit("player-changed", {
            id: other.id,
            name: other.name,
            ready: other.ready,
          })
        }
      })

      // Finally, (once all updates have been applied, inform the new player about the room
      // this.sendRoomDetailsTo(player)
    }
  }

  joinAI(player: AIPlayer): void
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

  leave(player: ConnectedPlayer): void
  {
    // Remove the player from the socket room
    player.socket.leave(this.id)

    console.log(`A player has left the room ${this.id}`)

    const index = this.players.findIndex((p) => p.id === player.id)
    this.players.splice(index, 1)

    // player left, broadcast to everyone
    this.io.to(this.id).emit("room-player-left", {
      id: player.id
    })

    // unset ready state on all remaining players
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

    // promote the first next player to host if there is one
    if (this.host === player.id)
    {
      console.log(`The host has left the room ${this.id}`)

      if (this.players.length > 0)
      {
        this.host = this.players[0].id
      }
      else
      {
        this.host = ""
      }
    }

    this.handleReadyStateChanged()
  }

  handlePlayerAction(player: Player, name: string, data: any, callback: IActionCallback): void
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

  onPlayerChanged(player: Player): void
  {
    this.io.to(this.id).emit("player-changed", {
      id: player.id,
      name: player.name,
      ready: player.ready,
    })

    this.handleReadyStateChanged()
  }

  onTogglePlayerReady(player: Player): void
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

  sendRoomDetailsTo(to: ConnectedPlayer): void
  {
    // Inform the player about the room
    to.socket.emit("room-joined", this.toJSON())
  }

  sendRoomUpdate(): void
  {
    console.log(`Send room ${this.id} update`)
    this.io.to(this.id).emit("room-update", {
      id: this.id,
      status: this.status,
      countdown: this.countdown,
      options: this.options,
    })
  }

  cancelCountdown(status: RoomStatus): void
  {
    this.status = status
    // Type cast is required as setInterval returns a NodeJS.Timer...
    clearInterval(this.countdownTimer as NodeJS.Timeout)
    this.countdownTimer = undefined
    this.countdown = 0
  }

  handleReadyStateChanged(): void
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
}

export default Room