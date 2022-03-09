import React from "react"
import Recoil from "recoil"
import { Navigate } from "react-router-dom"
import { AGame } from "../../data/Game"


// const Planet = ({ id }: { id: number }) => {
//   const p = Recoil.useRecoilValue(planetSelector(id))
//   const [ c, setC ] = React.useState(0)

//   React.useEffect(() => {
//     const r = c + 1
//     setC(r)
//   }, [p])

//   let content
//   if (!p)
//   {
//     content = <div>Planet {id} not found</div>
//   }
//   else
//   {
//     content = (<div>Planet {p.id} - {p.population} ({c})</div>)
//   }

//   return content
// }

const Game = () => {
  // const planets = Recoil.useRecoilValue(planetsSelector)

  return (
    <div>in game
      {/* <ul>
        {planets.map(p => <div key={p.id}>Planet {p.id}</div>)}
      </ul>
      <Planet id={0} />
      <Planet id={1} /> */}
    </div>
  )
}

const GameRoot = () => {
  const game = Recoil.useRecoilValue(AGame)

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