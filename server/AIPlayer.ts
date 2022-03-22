import { IPlayer, IRoom } from "./types"

class AIPlayer implements IPlayer {
  id: string
  name: string
  room?: IRoom
  ready: boolean

  constructor()
  {
    this.id = crypto.randomUUID()
    this.name = ""
    this.room = undefined
    this.ready = true
  }

  send(message: string, data: object)
  {

  }
}