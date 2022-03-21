import crypto from "crypto"
import EventEmitter from "events"
import { SocketIO, ServerEventEmitter } from "./serverTypes"
import Room from "./lobby/Room"
import Game from "./Game"
import { IPlayer } from "./types"

class Player implements IPlayer {
  id: string
  socket: SocketIO
  name: string
  room: Room | undefined
  game: Game | undefined
  ready: boolean
  events: ServerEventEmitter

  constructor(socket: SocketIO)
  {
    this.id = crypto.randomUUID()
    this.socket = socket
    this.name = ""
    this.room = undefined
    this.game = undefined
    this.ready = false
    this.events = new EventEmitter() as ServerEventEmitter

    socket.emit("registered", { id: this.id })

    // bind socket events
    this.handleReadyToggle = this.handleReadyToggle.bind(this)
    this.handleLeaveRoom = this.handleLeaveRoom.bind(this)
    this.handleLeaveGame = this.handleLeaveGame.bind(this)
  }

  handleJoinRoom(room: Room)
  {
    this.ready = false
    this.room = room

    this.socket.once("player-ready-toggle", this.handleReadyToggle)
    this.socket.on("player-leave-room", this.handleLeaveRoom)
  }

  handleReadyToggle()
  {
    console.log(`Toggle player ${this.id} ready status ${this.ready}`)

    this.ready = !this.ready

    console.assert(this.room, `Player ${this.id} is not in a room`)
    this.room?.onTogglePlayerReady(this)
  }

  handleLeaveRoom()
  {
    console.log(`Player ${this.id} leave room ${this.room?.id}`)
    if (this.room)
    {
      this.room.leave(this)
      this.room = undefined
      this.ready = false
    }

    this.socket.off("player-ready-toggle", this.handleReadyToggle)
    this.socket.off("player-leave-room", this.handleLeaveRoom)
  }

  handleJoinGame(game: Game)
  {
    this.game = game

    this.socket.once("player-leave-game", this.handleLeaveGame)
  }

  handleLeaveGame()
  {
    console.log(`Player ${this.id} leave game ${this.room?.id}`)
    if (this.game)
    {
      this.game.leave(this)
      this.game = undefined
      this.ready = false
    }

    this.socket.off("player-leave-game", this.handleLeaveGame)
  }
}

export default Player