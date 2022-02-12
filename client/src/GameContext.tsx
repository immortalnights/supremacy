import React from "react"
import Recoil from "recoil"
import { DGame } from "./data"

export type initializeFn = (saveGameData?: object) => void

interface IGameContext {
  initialized: boolean
  initialize: initializeFn
  postMessage: (msg: IMessage) => void
}

export const GameContext = React.createContext<IGameContext>({
  initialized: false,
  initialize: () => {
    throw new Error("Cannot initialize default Game Context")
  },
  postMessage: (msg) => {
    throw new Error("Cannot postMessage to uninitialized Game Context")
  }
})

interface IGameContextProviderProps {
  children: React.ReactNode
}

export const GameContextProvider = ({ children }: IGameContextProviderProps) => {
  const [ worker, setWorker ] = React.useState<Worker | null>(null)
  // const [ game, setGame ] = Recoil.useRecoilState(DGame)
  const callback = Recoil.useRecoilCallback(({ snapshot, set }) => (data: any, changes: any) => {
    if (changes)
    {
      // console.debug("Incremental UPDATE received")
      const hasChanges = changes.planets.length > 0 || changes.ships > 0 || changes.platoons > 0
      if (hasChanges)
      {
        // copy game data
        const updated = { ...snapshot.getLoadable(DGame).contents }

        // planets
        if (changes.planets.length > 0)
        {
          updated.planets = [ ...updated.planets ]
          changes.planets.forEach((id: number) => {
            updated.planets[id] = data.planets[id]
          })
        }

        set(DGame, updated)
      }
    }
    else
    {
      console.debug("Initial UPDATE received")
      set(DGame, data)
    }
  })

  const initialize = (saveGameData?: object) => {
    const worker = new window.Worker(`${process.env.PUBLIC_URL}/supremacy/index.js`, { type: "module" })

    worker.onmessage = (event) => {
      const msg: IMessage = event.data

      switch (msg.type)
      {
        case "UPDATE":
        {
          callback(msg.data, (msg as IUpdateMessage).changes)
          break
        }
        case "SAVE_GAME":
        {
          localStorage.setItem("game_id", msg?.data.id)
          localStorage.setItem("game", JSON.stringify(msg.data))
          console.debug("Game saved", Date.now())
          break
        }
        default:
        {
          console.warn(`Received unhandled message '${msg.type}'`)
          break
        }
      }
      // console.log("received", event.data)
    }

    if (saveGameData)
    {
      worker.postMessage({
        type: "LOAD",
        data: saveGameData,
      })
    }
    else
    {
      worker.postMessage({
        type: "CREATE",
      })
    }

    setWorker(worker)
  }

  // provide a proper interface here?
  const postMessage = (msg: IMessage) => {
    if (!worker)
    {
      throw new Error("Worker has not been initialized")
    }

    worker.postMessage(msg)
  }

  const value = {
    initialized: !!worker,
    initialize,
    postMessage,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export interface IMessage {
  type: string
  data?: any
}

export interface IUpdateMessage extends IMessage {
  changes: any
}

export const useGameContext = () => {
  return React.useContext(GameContext)
}
