import crypto from "crypto"
import EventEmitter from "events"
import { Server } from "socket.io"
import { ServerEventEmitter } from "../serverTypes"
import { IRoom, RoomStatus, IRoomOptions } from "../types"
import Player from "../Player"

const randomSeedString = (length: number = 6) => {
  return (Math.random() + 1).toString(36).substring(length);
}

class Room implements IRoom {
  id: string
  options: IRoomOptions
  host: string
  slots: number
  players: Player[]
  game: undefined
  status: RoomStatus
  io: Server
  events: ServerEventEmitter
  countdownTimer: NodeJS.Timer | undefined

  constructor(io: Server, host: Player)
  {
    this.id = crypto.randomUUID()
    this.options = {
      seed: "",
      countdown: 10,
    }
    this.host = ""
    this.slots = 2
    this.players = []
    this.game = undefined
    this.status = RoomStatus.Setup
    this.io = io
    this.events = new EventEmitter() as ServerEventEmitter
    this.countdownTimer = undefined

    this.hostJoined(host)
  }

  hostJoined(player: Player)
  {
    this.host = player.id
    this.players.push(player)

    // Join the socket room
    player.socket.join(this.id)

    this.sendRoomDetailsTo(player)
  }

  join(player: Player)
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

    // Unset ready state on all players
    this.players.forEach((other) => {
      other.ready = false

      this.io.to(this.id).emit("player-ready-status-changed", {
        id: other.id,
        ready: other.ready,
      })
    })
  }

  sendRoomDetailsTo(to: Player)
  {
    // Optional delay to verify UI
    setTimeout(() => {
      // Inform the player about the room
      to.socket.emit("room-joined", {
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
      })
    }, 1000)
  }

  sendRoomUpdate()
  {
    console.log(`Send room ${this.id} update`)
    this.io.to(this.id).emit("room-update", {
      id: this.id,
      status: this.status,
      options: this.options,
    })
  }

  toggleReady(player: Player)
  {
    // console.log(`Broadcast ready state change ${this.id}, ${player.id}, ${player.ready}`)

    // Broadcast to all players (including the one that made the request)
    this.io.to(this.id).emit("player-ready-status-changed", {
      id: player.id,
      ready: player.ready,
    })

    // If all players are ready, begin the countdown (minimum player count should not be fixed)
    if (this.players.length === 2 && this.players.every((p) => p.ready))
    {
      console.log(`All players are ready in room ${this.id}, begin countdown`)

      const doCountdown = () => {
        this.options.countdown -= 1

        if (this.options.countdown === 0)
        {
          // TODO
          console.log(`Start countdown complete for room ${this.id}`)
          this.status = RoomStatus.Playing
          // Type cast is required as setInterval returns a NodeJS.Timer...
          clearInterval(this.countdownTimer as NodeJS.Timeout)
          this.countdownTimer = undefined
          this.options.countdown = 0
        }

        this.sendRoomUpdate()
      }

      // Start the countdown at ten
      this.options.countdown = 10
      this.status = RoomStatus.Starting
      this.countdownTimer = setInterval(doCountdown, 1000)

      // Send the initial countdown time
      this.sendRoomUpdate()
    }
    // Not everyone is ready, cancel the countdown
    else if (this.status === RoomStatus.Starting)
    {
      this.status = RoomStatus.Setup
      // Type cast is required as setInterval returns a NodeJS.Timer...
      clearInterval(this.countdownTimer as NodeJS.Timeout)
      this.countdownTimer = undefined
      this.options.countdown = 0
      this.sendRoomUpdate()
    }
  }

  leave(player: Player)
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
        if (player instanceof Player)
        {
          player.socket.emit("room-player-kicked")
        }
      })

      // Remove all players from the room
      this.players = []
      this.status = RoomStatus.Closed

      this.events.emit("room-cleanup", this.id)
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
        other.ready = false

        this.io.to(this.id).emit("player-ready-status-changed", {
          id: other.id,
          ready: other.ready,
        })
      })
    }
  }

  empty()
  {
    return this.players.length === 0
  }
}


export const createRoom = (io: Server, host: Player): Room => {
  const room = new Room(io, host)
  room.options.seed = randomSeedString()
  return room
}

export default Room