import { useAtomValue } from "jotai"
import { Planet } from "../../Game/entities"
import { sessionAtom, planetsAtom } from "../../Game/store"
import EntityGrid from "../EntityGrid"

export default function PlanetGrid({
    onSelectPlanet,
}: {
    onSelectPlanet: (planet: Planet) => void
}) {
    const { localPlayer } = useAtomValue(sessionAtom)
    const planets = useAtomValue(planetsAtom)
    const filteredPlanets = planets.filter(
        (planet) => planet.type !== "lifeless",
    )

    return (
        <EntityGrid
            entities={filteredPlanets}
            fixedPositions={true}
            localPlayer={localPlayer}
            onClick={onSelectPlanet}
        />
    )
}
