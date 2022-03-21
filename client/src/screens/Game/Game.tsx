import React from "react"
import Recoil from "recoil"
import { IOContext } from "../../data/IOContext"
import { useNavigate, useParams } from "react-router-dom"
import { IPlayer } from "../../data/Player"
import { Game as GameData, IGame } from "../../data/Game"

const PlayerList = ({ players }: { players: IPlayer[] }) => {
  return (
    <ul>
      {players.map((player) => (
        <li key={player.id}>{player.name || player.id} {player.ready}</li>
      ))}
    </ul>
  )
}

const Game = ({ data }: { data: IGame }) => {
  return (
    <>
      <p>In Game {data.id}!</p>
      <PlayerList players={data.players} />
    </>
  )
}


const GameLoader = () => {
  const game = Recoil.useRecoilValue(GameData)
  const { joinGame, leaveGame } = React.useContext(IOContext)
  const navigate = useNavigate()
  const params = useParams()

  React.useEffect(() => {
    const join = async (id: string) => {
      try
      {
        console.log("join?")
        await joinGame(id)
      }
      catch (error)
      {
        console.warn(`Failed to join game ${params.id}`)
        navigate("/", { replace: true })
      }
    }

    if (!game)
    {
      if (params.id)
      {
        console.log("join?1")
        join(params.id)
      }
      else
      {
        navigate("/", { replace: true })
      }
    }
  }, [ game, params ])

  React.useEffect(() => {
    return () => {
      console.log("Clean up GameLoader")
      leaveGame()
    }
  }, [])

  return (game ? <Game data={game} /> : <div>Joining Room...</div>)
}

export default GameLoader