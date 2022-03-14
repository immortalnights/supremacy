import React from "react"
import Recoil from "recoil"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { AGame } from "../../data/Game"
import { useLocalStorage } from "../../data/localStorage"

// New game flow
// xhr to server to create game
// wait for response
  // in the future it would be good to have this over ws and neat "start game" progress
  // server builds universe (typically this is super fast, but separate for future expansion)
  // wait for all players to connect (1 or more as needed)
// response contains game id
// play moves to game screen

const states = [
  "Creating Universe...",
  "Joining Game..."
]

const Setup = () => {
  const [ game, setGame ] = Recoil.useRecoilState(AGame)
  const [ currentGameId, setCurrentGameId ] = useLocalStorage("game")
  const [ currentPlayerId, setCurrentPlayerId ] = useLocalStorage("player")
  const params = useParams()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const navigate = useNavigate()

  React.useEffect(() => {
    let req
    if (params.id)
    {
      req = fetch("/api/join", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId: currentPlayerId,
          gameId: currentGameId,
        }),
      })
    }
    else
    {
      req = fetch("/api/create", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId: currentPlayerId,
          multiplayer: Number(searchParams.get("multiplayer")) === 1
        }),
      })
    }

    req.then((res) => {
      return res.ok && res.json()
    }).then((data) => {
      if (data.ok)
      {
        // save the game id in local storage to allow continuing
        setCurrentGameId(data.universe.id)
        setCurrentPlayerId(data.playerId)
        setGame(data.universe)
      }
      else
      {
        // return to main menu
        navigate("/")
      }
    })


  }, [])

  React.useEffect(() => {
    if (game)
    {
      setTimeout(() => {
        navigate(`/play/${game.id}`, { replace: true })
      }, 2000)
    }
  }, [ game ])

  let index = game ? 1 : 0

  return (
    <div style={{ textAlign: "center" }}>{states[index]}</div>
  )
}

export default Setup