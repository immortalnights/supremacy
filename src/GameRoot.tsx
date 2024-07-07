import { Provider } from "jotai"
import { Link, Outlet } from "react-router-dom"
import { store } from "./Game/store"
import { Suspense } from "react"

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

export default function InGame() {
    return (
        <Suspense fallback="Loading...">
            <Provider store={store}>
                <Outlet />
            </Provider>
        </Suspense>
    )
}
