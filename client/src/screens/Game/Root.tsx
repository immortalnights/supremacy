import React from "react"
import Recoil from "recoil"
import { DGame, planetsSelector, planetSelector } from "../../data"
import { saveGameState } from "../../saveGameState"
import { Navigate } from "react-router-dom"


const Planet = ({ id }: { id: number }) => {
	const p = Recoil.useRecoilValue(planetSelector(id))
	const [ c, setC ] = React.useState(0)

	React.useEffect(() => {
		const r = c + 1
		setC(r)
	}, [p])

  let content
  if (!p)
  {
    content = <div>Planet {id} not found</div>
  }
  else
  {
		content = (<div>Planet {p.id} - {p.population} ({c})</div>)

  }

	return content
}

const Game = () => {
	const planets = Recoil.useRecoilValue(planetsSelector)

	return (
		<div>
			<ul>
				{planets.map(p => <div key={p.id}>Planet {p.id}</div>)}
			</ul>
			<Planet id={0} />
			<Planet id={1} />
		</div>
	)
}

const GameRoot = () => {
  const game = Recoil.useRecoilValue(DGame)
  const saveCallback = Recoil.useRecoilCallback(({ snapshot, set }) => () => {
    const game = snapshot.getLoadable(DGame).contents
    localStorage.setItem("game_id", game.id)
    localStorage.setItem("game", JSON.stringify(game))

    set(saveGameState, {
      state: "",
      lastSaved: Date.now(),
    })
  })

  React.useEffect(() => {
    const saveInterval = setInterval(() => {
      saveCallback()
    }, 5000)

    return () => {
      clearInterval(saveInterval)
    }
  }, [])

  let content

  if (!game || !game.id)
  {
    console.warn("No game state data, redirect to main menu")
    content = (<Navigate to="/" replace />)
  }
  else
  {
    content = (<Game />)
  }

  return content
}

export default GameRoot