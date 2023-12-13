import React from "react"
import Recoil from "recoil"
import { Box } from "@mui/material"
import { useNavigate } from "react-router"
import { SelectedPlanetID } from "../../../data/General"
import { Game } from "../../../data/Game"
import { IPlayer, Player } from "../../../data/Player"
import { IPlanet, SelectedPlanet, CapitalPlanet } from "../../../data/Planets"

const AccessDenied = () => {
    const game = Recoil.useRecoilValue(Game)
    const capital = Recoil.useRecoilValue(CapitalPlanet)
    const [_selectedPlanet, setSelectedPlanet] =
        Recoil.useRecoilState(SelectedPlanetID)
    const navigate = useNavigate()

    React.useEffect(() => {
        const timer = window.setTimeout(() => {
            setSelectedPlanet(capital.id)
            navigate(`/game/${game!.id}/`)
        }, 1000)

        return () => {
            window.clearTimeout(timer)
        }
    }, [capital, game, navigate, setSelectedPlanet])

    return (
        <Box
            sx={{
                color: "error.main",
                textAlign: "center",
                border: "1px solid red",
                borderRadius: 2,
                padding: 1,
                width: 180,
                margin: "0 auto",
            }}
        >
            Access Denied
        </Box>
    )
}

interface PlanetAuthProps {
    view: (planet: IPlanet) => React.ReactElement
    check?: () => boolean
}

const PlanetAuth = ({ view, check }: PlanetAuthProps) => {
    const player = Recoil.useRecoilValue(Player) as IPlayer
    const planet = Recoil.useRecoilValue(SelectedPlanet) as IPlanet
    const hasAccess = () =>
        planet.owner === player.id || (check !== undefined && check())

    let content
    if (!planet) {
        content = (
            <Box
                sx={{
                    color: "darkblue",
                    textAlign: "center",
                    border: "1px solid blue",
                    borderRadius: 2,
                    padding: 1,
                    width: 180,
                    margin: "0 auto",
                }}
            >
                Loading
            </Box>
        )
    } else if (false === hasAccess()) {
        content = <AccessDenied />
    } else {
        content = view(planet)
    }

    return content
}

export default PlanetAuth
