import React from "react"
import Recoil, { TransactionInterface_UNSTABLE } from "recoil"
import IOProvider from "./data/IOContext"
import { IPlayer, IRoom, IRoomDetails } from "./types.d"
import { Player } from "./data/Player"
import { Room } from "./data/Room"

const handleRegistered = ({ id }: { id: string }, { get, set }: TransactionInterface_UNSTABLE) => {
  const player = { ...get(Player), id, }
  set(Player, player)
}

type TransactionHandler = (data: any, callback: TransactionInterface_UNSTABLE) => void

const handleRoomJoined: TransactionHandler = (data: IRoomDetails, { get, set }) => {
  const player = get(Player)

  const isHost = player.id === data.host

  set(Player, { ...player, ready: false })

  // Set the room data
  set(Room, {
    id: data.id,
    host: data.host,
    options: {},
    slots: data.slots,
    players: data.players,
    status: "pending",
  })
}

const handleRoomKickPlayer: TransactionHandler = (data, { get, set }) => {
  // Player has been kicked, push them back to the main menu
  set(Room, undefined)
}

const handleRoomPlayerJoined: TransactionHandler = (player: IPlayer, { get, set }) => {
  const room = get(Room) as IRoom

  const existingPlayer = room.players.find((p) => p.id === player.id)
  if (!existingPlayer)
  {
    set(Room, { ...room, players: [ ...room.players, player ] })
  }
}

const handleRoomPlayerLeft: TransactionHandler = ({ id }: { id: string }, { get, set }) => {
  const room = get(Room) as IRoom

  const index = room.players.findIndex((p) => p.id === id)
  if (index !== -1)
  {
    const players = [ ...room.players ]
    players.splice(index, 1)
    set(Room, { ...room, players })
  }

}

const handleReadyStateChanged: TransactionHandler = ({ id, ready }: { id: string, ready: boolean }, { get, set }) => {
  const room = get(Room) as IRoom
  const player = get(Player)

  if (id === player.id)
  {
    set(Player, { ...player, ready })
  }

  const index = room.players.findIndex((p) => p.id === id)
  if (index !== -1)
  {
    const players = [ ...room.players ]
    players[index] = { ...players[index], ready }
    set(Room, { ...room, players })
  }
}

interface IMessageHandlerMap {
  [key: string]: TransactionHandler
}

const MessageHandlerMap: IMessageHandlerMap = {
  "registered": handleRegistered,
  "room-joined": handleRoomJoined,
  "room-player-kicked": handleRoomKickPlayer,
  "room-player-joined": handleRoomPlayerJoined,
  "room-player-left": handleRoomPlayerLeft,
  "player-ready-status-changed": handleReadyStateChanged,
}


// Binds the Socket and Recoil data together using RecoilTransaction
const DataProvider = ({ children }: { children: JSX.Element }) => {
  console.log("Render DataProvider")
  const SocketToRecoil = () => {
    const handleMessage = Recoil.useRecoilTransaction_UNSTABLE((callback) => (action: string, data: any = {}) => {
      console.log("received", action, data)

      if (action === "disconnect")
      {
        console.log("Disconnected!")
        callback.reset(Player)
        callback.reset(Room)
      }
      else if (MessageHandlerMap[action])
      {
        MessageHandlerMap[action](data, callback)
      }
      else
      {
        console.error(`Message '${action}' is not handled in Data Provider`)
      }
    })

    return (
      <IOProvider handleMessage={handleMessage}>
        {children}
      </IOProvider>
    )
  }

  return (
    <Recoil.RecoilRoot initializeState={() => {}}>
      <SocketToRecoil />
    </Recoil.RecoilRoot>
  )
}

export default DataProvider