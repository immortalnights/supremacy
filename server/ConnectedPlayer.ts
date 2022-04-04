import EventEmitter from "events"
import { SocketIO, ServerEventEmitter } from "./serverTypes"
import { IActionCallback, PlayerRoomAction } from "./types"
import Player from "./Player"
import Room from "./lobby/Room"
import Game from "./Game"

export default class ConnectedPlayer extends Player
{
  socket: SocketIO
  events: ServerEventEmitter

  constructor(socket: SocketIO)
  {
    super()
    this.socket = socket
    this.events = new EventEmitter() as ServerEventEmitter

    socket.emit("registered", { id: this.id })

    // bind socket events
    this.handleRoomAction = this.handleRoomAction.bind(this)
    this.handleReadyToggle = this.handleReadyToggle.bind(this)
    this.handleLeaveRoom = this.handleLeaveRoom.bind(this)
    this.handleGameAction = this.handleGameAction.bind(this)
    this.handleLeaveGame = this.handleLeaveGame.bind(this)
  }

  handleJoinRoom(room: Room)
  {
    this.ready = false
    this.room = room

    this.socket.on("player-room-action", this.handleRoomAction)
    this.socket.once("player-leave-room", this.handleLeaveRoom)
  }

  handleRoomAction(name: PlayerRoomAction, data: any, callback: IActionCallback)
  {
    console.debug(`Received player ${this.id} action ${name}`)

    if (this.room)
    {
      switch (name)
      {
        case "change-room-name":
        {
          const body = data as { name: string }
          this.name = body.name

          this.room.onPlayerChanged(this)

          callback(true, "", {})
          break
        }
        case "toggle-ready":
        {
          console.log(`Toggle player ${this.id} ready status ${this.ready}`)
          this.ready = !this.ready
          this.room.onPlayerChanged(this)

          callback(true, "", {})
          break
        }
        default:
        {
          this.room.handlePlayerAction(this, name, data, callback)
          break
        }
      }
    }
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

    this.socket.off("player-room-action", this.handleRoomAction)
    this.socket.off("player-leave-room", this.handleLeaveRoom)
  }

  handleJoinGame(game: Game<any>)
  {
    this.game = game

    this.socket.on("player-game-action", this.handleGameAction)
    this.socket.once("player-leave-game", this.handleLeaveGame)
  }

  handleGameAction(name: string, data: object, callback: IActionCallback)
  {
    if (this.game)
    {
      this.game.handlePlayerAction(this, name, data, callback)
    }
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

    this.socket.off("player-game-action", this.handleGameAction)
    this.socket.off("player-leave-game", this.handleLeaveGame)
  }
}