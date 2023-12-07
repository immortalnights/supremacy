import React from "react"

export interface IContext {
    gameId?: string
    playerId?: string
}

const Context = React.createContext<IContext>({
    gameId: undefined,
    playerId: undefined,
})

export default Context
