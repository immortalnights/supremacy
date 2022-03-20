import crypto from "crypto"
import EventEmitter from "events"
import { SocketIO, ServerEventEmitter } from "./serverTypes"
import Room from "./lobby/Room"
import { IPlayer } from "./types"

class Player implements IPlayer {
  id: string
  socket: SocketIO
  name: string
  room: Room | undefined
  ready: boolean
  game: string | undefined
  events: ServerEventEmitter

  constructor(socket: SocketIO)
  {
    this.id = crypto.randomUUID()
    this.socket = socket
    this.name = ""
    this.room = undefined
    this.ready = false
    this.game = undefined
    this.events = new EventEmitter() as ServerEventEmitter

    socket.emit("registered", { id: this.id })

    // FIXME maybe move room specific events to room handler
    // stop listening for these when the player is in a game?
    // listen to room-create / room-join from the server and the rest from within the room class?

    socket.on("room-create", (callback) => {
      if (this.room)
      {
        // Already in a room, cannot create another
        // can sometimes be received on reload/hot reload
        console.log("player already in a room")
        this.room.sendRoomDetailsTo(this)
        callback(true)
      }
      else
      {
        this.events.emit("player-create-room", this)
        callback(!!this.room)
      }
    })

    socket.on("room-join", (id: string, callback) => {
      console.log("player", this.id, "attempting to join room", id)
      // Ensure the players ready state is false
      this.ready = false
      this.events.emit("player-join-room", this, id)
      callback(!!this.room)
    })

    socket.on("player-ready-toggle", () => {
      if (this.room)
      {
        console.log(`Toggle player ${this.id} ready status ${this.ready}`)

        this.ready = !this.ready

        this.room.toggleReady(this)
      }
      else
      {
        console.warn(`Player ${this.id} is not in a room!`)
      }
    })

    socket.on("room-leave", () => {
      console.log(`(room-leave) Player ${this.id} left room ${this.room?.id}`)
      if (this.room)
      {
        this.room.leave(this)
        this.room = undefined
        this.ready = false
      }
    })
  }
}

export default Player