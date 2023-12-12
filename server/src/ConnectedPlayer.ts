import EventEmitter from "events"
import { SocketIO, ServerEventEmitter } from "./serverTypes"
import { IActionCallback, PlayerRoomAction } from "./types"
import Player from "./Player"
import Room from "./lobby/Room"
import Game from "./Game"

export default class ConnectedPlayer extends Player {
    socket: SocketIO
    events: ServerEventEmitter

    constructor(socket: SocketIO) {
        super()
        this.socket = socket
        this.events = new EventEmitter() as ServerEventEmitter

        socket.emit("registered", { id: this.id })

        // bind socket events
        this.handleRoomAction = this.handleRoomAction.bind(this)
        this.handleGameAction = this.handleGameAction.bind(this)
    }

    handleJoinRoom(room: Room) {
        this.ready = false
        this.room = room

        this.socket.on("player-room-action", this.handleRoomAction.bind(this))
    }

    handleRoomAction(
        name: PlayerRoomAction,
        data: any,
        callback: IActionCallback
    ) {
        console.debug(`Received player ${this.id} action ${name}`)

        if (this.room) {
            switch (name) {
                case "change-room-name": {
                    const body = data as { name: string }
                    this.name = body.name

                    this.room.onPlayerChanged(this)

                    callback(true, "", {})
                    break
                }
                case "toggle-ready": {
                    console.log(
                        `Toggle player ${this.id} ready status ${this.ready}`
                    )
                    this.ready = !this.ready
                    this.room.onPlayerChanged(this)

                    callback(true, "", {})
                    break
                }
                default: {
                    this.room.handlePlayerAction(this, name, data, callback)
                    break
                }
            }
        }
    }

    handleLeaveRoom() {
        if (this.room) {
            console.log(`Player ${this.id} leaving room ${this.room.id}`)
            this.room.leave(this)
            this.room = undefined
            this.ready = false
        }

        this.socket.off("player-room-action", this.handleRoomAction)
    }

    handleJoinGame(game: Game<unknown>) {
        this.game = game

        this.socket.on("player-game-action", this.handleGameAction.bind(this))
    }

    handleGameAction(name: string, data: object, callback: IActionCallback) {
        if (this.game) {
            this.game.handlePlayerAction(this, name, data, callback)
        }
    }

    handleLeaveGame() {
        if (this.game) {
            console.log(`Player ${this.id} leaving game ${this.game.id}`)
            this.game.leave(this)
            this.game = undefined
            this.ready = false
        }

        this.socket.off("player-game-action", this.handleGameAction.bind(this))
    }
}
