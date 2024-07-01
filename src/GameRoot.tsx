import { Getter, Provider, Setter, useSetAtom, useStore } from "jotai"
import { Link, Outlet } from "react-router-dom"
import {
    dateAtom,
    planetsAtom,
    platoonsAtom,
    shipsAtom,
    stateAtom,
    store,
} from "./Game/store"
import {
    ReactNode,
    Suspense,
    createContext,
    useCallback,
    useEffect,
    useMemo,
} from "react"
import { Planet, Ship, Platoon } from "./Game/entities"
import { useAtomCallback } from "jotai/utils"

// const game_speed = {
//     slow: 2500,
//     normal: 1000,
//     fast: 500,
// }

// const simulatePlanet = (
//     originalPlanet: Planet,
//     platoonsOnPlanet: Platoon[],
//     shipsOnPlanet: Ship[],
// ) => {
//     const planet = { ...originalPlanet }

//     if (planet.capital) {
//         planet.population += 1
//     }

//     return planet
// }

// const simulate = ({
//     date: originalDate,
//     planets: originalPlanets,
//     ships: originalShips,
//     platoons: originalPlatoons,
// }: {
//     date: number
//     planets: Planet[]
//     ships: Ship[]
//     platoons: Platoon[]
// }) => {
//     const date = originalDate + 1
//     // Combat can change planet ownership, so Platoons are simulated first
//     const platoons = originalPlatoons
//     // Ships can influence planets, so are simulated second
//     const ships = originalShips
//     // Finally, planets are simulated
//     const planets = originalPlanets.map((planet) =>
//         simulatePlanet(planet, platoons, ships),
//     )

//     return { date, planets, ships, platoons }
// }

// const tick = () => {
//     const state = store.get(stateAtom)

//     console.log(state)

//     if (state === "playing") {
//         const date = store.get(dateAtom)
//         const planets = store.get(planetsAtom)
//         const ships = store.get(shipsAtom)
//         const platoons = store.get(platoonsAtom)

//         // FIXME game state is lost when atoms are promises (loading from localStorage)

//         const modified = simulate({
//             date,
//             planets,
//             ships,
//             platoons,
//         })

//         store.set(dateAtom, modified.date)
//         store.set(planetsAtom, modified.planets)
//         store.set(shipsAtom, modified.ships)
//         store.set(platoonsAtom, modified.platoons)
//     }

//     setTimeout(tick, 1000)
// }

// setTimeout(tick, 1000)

function Simulation() {
    const setState = useSetAtom(stateAtom)

    useEffect(() => {
        setState("playing")

        return () => {
            setState("paused")
        }
    }, [setState])

    return null
}

export default function InGame() {
    return (
        <Suspense fallback="Loading...">
            <Provider store={store}>
                <Outlet />
                <div>
                    <Link to={"/"}>Quit</Link>
                </div>
            </Provider>
        </Suspense>
    )
}
