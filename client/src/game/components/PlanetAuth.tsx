import React from "react"
import Recoil from "recoil"
import { Box } from "@mui/material"
import { useNavigate } from "react-router"
import { IPlayer, Player } from "../../data/Player"
import { SelectedPlanet, IPlanet } from "../../data/Planets"


const AccessDenied = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(-1)
    }, 1000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  return (<Box sx={{ color: "error.main", textAlign: "center", border: "1px solid red", borderRadius: 2, padding: 1, width: 180, margin: "0 auto" }}>Access Denied</Box>)
}

const PlanetAuth = ({ view }: { view: (planet: IPlanet) => JSX.Element }) => {
  const player = Recoil.useRecoilValue(Player) as IPlayer
  const planet = Recoil.useRecoilValue(SelectedPlanet) as IPlanet

  let content
  if (!planet)
  {
    content = (<Box sx={{ color: "error.main", textAlign: "center", border: "1px solid red", borderRadius: 2, padding: 1, width: 180, margin: "0 auto" }}>Loading</Box>)
  }
  else if (planet.owner !== player.id)
  {
    content = (<AccessDenied />)
  }
  else
  {
    content = view(planet)
  }

  return content
}

export default PlanetAuth