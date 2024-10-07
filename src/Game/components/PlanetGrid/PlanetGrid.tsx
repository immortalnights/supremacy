import { useAtomValue } from "jotai"
import { Planet } from "../../entities"
import { sessionAtom, planetsAtom } from "../../store"
import EntityGrid from "../EntityGrid"

export default function PlanetGrid({
    onClick,
}: {
    onClick: (planet: Planet) => void
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
            onClick={onClick}
        />
    )
}
