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


const QuitGame = () => {
  const reset = Recoil.useResetRecoilState(DGame)
  const context = useGameContext()

  React.useEffect(() => {
    reset()
    context.postMessage({
      type: "QUIT",
    })
  }, [])

  return (<Navigate to="/" replace />)
}

export default QuitGame