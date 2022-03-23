import React from "react"
import Recoil, { TransactionInterface_UNSTABLE } from "recoil"
import IOProvider from "./data/IOContext"
import { IPlayer, IRoom, RoomStatus, IGameOptions, IGame, IUpdate } from "./types.d"
import { Player } from "./data/Player"
import { Room, AvailableRooms } from "./data/Room"
import { Game } from "./data/Game"
import { SolarSystem, SelectedPlanet } from "./data/SolarSystem"
import { Planets } from "./data/Planets"
import { Ships } from "./data/Ships"
import { Platoons } from "./data/Platoons"
import type { IUniverse } from "./simulation/types.d"

const handleRegistered = ({ id }: { id: string }, { get, set }: TransactionInterface_UNSTABLE) => {
  const player = { ...get(Player), id, }
  set(Player, player)
}

type TransactionHandler = (data: any, callback: TransactionInterface_UNSTABLE) => void

const handleRoomList: TransactionHandler = (data: any, { get, set }) => {
  set(AvailableRooms, data)
}

const handleRoomJoined: TransactionHandler = (data: IRoom, { get, set }) => {
  const player = get(Player)

  set(Player, { ...player, ready: false })

  // Set the room data
  set(Room, data)
}

const handleRoomKickPlayer: TransactionHandler = (data, { reset }) => {
  // Player has been kicked, push them back to the main menu
  reset(Room)
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

interface RoomUpdateArgs { id: string, status: RoomStatus, countdown: number, options: IGameOptions }

const handleRoomUpdate: TransactionHandler = ({ id, status, countdown, options }: RoomUpdateArgs, { get, set }) => {
  const room = get(Room) as IRoom

  if (room)
  {
    // replace options with new options
    console.assert(room.id === id, "Current room does not match ID of received update")
    set(Room, { ...room, status, countdown, options })
  }
  else
  {
    console.warn("Received room update when no longer in a room")
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

const handleGameCreated: TransactionHandler = (data: IGame, { get, set }) => {
  // The create game message is handle in a specific handler
  // and triggers a navigate to the game screen, where the
  // the game data is received once the player has joined the
  // game.
}

const handleGameJoined: TransactionHandler = (data: IGame, { get, set, reset }) => {
  const player = get(Player)

  set(Player, { ...player, ready: false })

  // Reset any lingering game data
  reset(SolarSystem)
  reset(Planets)
  reset(Ships)
  reset(Platoons)
  reset(SelectedPlanet)

  set(Game, data)
}

const handleGamePlayerJoined: TransactionHandler = (player: IPlayer, { get, set }) => {
  const game = get(Game) as IGame

  const existingPlayer = game.players.find((p) => p.id === player.id)
  if (!existingPlayer)
  {
    set(Game, { ...game, players: [ ...game.players, player ] })
  }
}

const handleGamePlayerKicked: TransactionHandler = ({}: {}, { reset }) => {
  reset(Game)
  reset(SolarSystem)
  reset(Planets)
  reset(Ships)
  reset(Platoons)
  reset(SelectedPlanet)
}

const handleGameUpdate: TransactionHandler = (data: IUpdate<IUniverse>, { get, set }) => {
  // Apply the game data to the different atoms;

  const { planets, ships, platoons, ...solarSystem } = data.world

  // FIXME do this somewhere better
  let selected = get(SelectedPlanet)
  if (selected === -1)
  {
    const player = get(Player)
    console.warn(player.id, planets[0].owner, planets[planets.length - 1].owner )
    if (planets[0].owner === player.id)
    {
      selected = planets[0].id
    }
    else if (planets[planets.length - 1].owner === player.id)
    {
      selected = planets[planets.length - 1].id
    }
    else
    {
      // Find the first from 0 to x, would be better if the search was
      // based on the assumed players' capital
      const firstOwned = planets.find((planet) => planet.owner === player.id)
      selected = firstOwned?.id || 0
    }

    set(SelectedPlanet, selected)
  }

  set(SolarSystem, solarSystem)
  set(Planets, planets)
  set(Ships, ships)
  set(Platoons, platoons)
}

interface IMessageHandlerMap {
  [key: string]: TransactionHandler
}

const MessageHandlerMap: IMessageHandlerMap = {
  "registered": handleRegistered,
  "room-list": handleRoomList,
  "room-joined": handleRoomJoined,
  "room-player-kicked": handleRoomKickPlayer,
  "room-player-joined": handleRoomPlayerJoined,
  "room-player-left": handleRoomPlayerLeft,
  "room-update": handleRoomUpdate,
  "player-ready-status-changed": handleReadyStateChanged,
  "game-created": handleGameCreated,
  "game-joined": handleGameJoined,
  "game-player-joined": handleGamePlayerJoined,
  // "game-player-left": handleGamePlayerLeft,
  "game-player-kicked": handleGamePlayerKicked,
  "game-update": handleGameUpdate,
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
        callback.reset(Game)
        callback.reset(SolarSystem)
        callback.reset(SelectedPlanet)
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