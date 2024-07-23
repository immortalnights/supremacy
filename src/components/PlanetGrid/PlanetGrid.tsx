import { useAtomValue, useSetAtom } from "jotai"
import { Planet } from "../../Game/entities"
import { sessionAtom, selectedPlanetAtom, planetsAtom } from "../../Game/store"
import EntityGrid from "../EntityGrid"

export default function PlanetGrid() {
    const { localPlayer } = useAtomValue(sessionAtom)
    const setSelectedPlanet = useSetAtom(selectedPlanetAtom)
    const planets = useAtomValue(planetsAtom)
    const filteredPlanets = planets.filter(
        (planet) => planet.type !== "lifeless",
    )

    const handleSelectPlanet = (planet: Planet) => {
        // if (planet.owner === "local") {
        setSelectedPlanet(planet)
        // }
    }

    return (
        <EntityGrid
            entities={filteredPlanets}
            localPlayer={localPlayer}
            onClick={handleSelectPlanet}
        />
    )
}
