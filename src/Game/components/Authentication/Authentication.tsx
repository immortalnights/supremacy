import {
    useCapitalPlanet,
    useSelectedColonizedPlanet,
    useSelectedPlanet,
} from "Game/hooks"
import { selectedPlanetAtom, sessionAtom } from "Game/store"
import { platoonsOnPlanetAtom } from "Game/utilities/platoons"
import { shipsDocketAtPlanetAtom } from "Game/utilities/ships"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"

const useCanAccessPlanet = () => {
    const { localPlayer } = useAtomValue(sessionAtom)
    const selectedPlanet = useSelectedPlanet()
    return (
        selectedPlanet &&
        selectedPlanet.type !== "lifeless" &&
        selectedPlanet.owner === localPlayer
    )
}

const useIsPlanetContested = () => {
    const { localPlayer } = useAtomValue(sessionAtom)
    const selectedPlanet = useSelectedColonizedPlanet()
    const ships = useAtomValue(shipsDocketAtPlanetAtom).filter(
        selectedPlanet,
        localPlayer,
    )
    const platoons = useAtomValue(platoonsOnPlanetAtom).filter(
        selectedPlanet,
        localPlayer,
    )

    // A side effect is that the player is immediately navigated away
    // from a contested planet as soon as it becomes none contested.
    return ships.length > 0 || platoons.length > 0
}

export function AuthenticationWithRedirect() {
    const access = useCanAccessPlanet()
    const capital = useCapitalPlanet()
    const setSelectedPlanet = useSetAtom(selectedPlanetAtom)

    useEffect(() => {
        if (!access && capital) {
            setSelectedPlanet(capital)
        }
    }, [setSelectedPlanet, access, capital])

    return access ? <Outlet /> : null
}

export function Authentication() {
    const access = useCanAccessPlanet()

    if (!access) {
        return <Navigate to="./SolarSystem" />
    }

    return <Outlet />
}

export function CombatAuthentication() {
    const access = useCanAccessPlanet()
    const contested = useIsPlanetContested()

    if (!access && !contested) {
        return <Navigate to="./SolarSystem" />
    }

    return <Outlet />
}
