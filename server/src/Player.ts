import crypto from "crypto"
import Room from "./lobby/Room"
import Game from "./Game"
import { IPlayer } from "./types"
import Universe from "./simulation/Universe"

export default class Player implements IPlayer {
    id: string
    name: string
    ready: boolean
    room?: Room
    game?: Game<Universe>

    constructor() {
        this.id = crypto.randomUUID()
        this.name = ""
        this.ready = false
        this.room = undefined
        this.game = undefined
    }
}
