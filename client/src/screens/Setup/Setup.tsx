import React from "react"
import Recoil from "recoil"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom"
import { GameContextProvider, useGameContext, initializeFn } from "../../GameContext"
import { DGame, planetsSelector, planetSelector } from "../../data"

const Setup = () => {
  const context = useGameContext()
  const game = Recoil.useRecoilValue(DGame)
  const params = useParams()
  const navigate = useNavigate()

  console.log("context in Setup", context)
  React.useEffect(() => {
    let saveGameData
    if (params.id)
    {
      const value = localStorage.getItem("game")
      saveGameData = value ? JSON.parse(value) : undefined
      console.assert(Number(params.id) === saveGameData.id, "Save game data ID mismatch")
    }

    (context.initialize as initializeFn)(saveGameData)
  }, [])

  React.useEffect(() => {
    if (game)
    {
      console.log("Setup complete, navigate to game")
      navigate(`/play/${game.id}`, { replace: true })
    }
  }, [ game ])

  return (
    <div>setup</div>
  )
}

export default Setup