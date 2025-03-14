import { useAtomValue } from "jotai"
import { Planet } from "Supremacy/entities"
import { sessionAtom, planetsAtom } from "../../store"
import EntityGrid from "../EntityGrid"
import { useSession } from "Game/hooks/session"

export default function PlanetGrid({ onClick }: { onClick: (planet: Planet) => void }) {
    const { localPlayer } = useSession()
    const planets = useAtomValue(planetsAtom)
    const filteredPlanets = planets.filter((planet) => planet.type !== "lifeless")

    return (
        <EntityGrid
            entities={filteredPlanets}
            fixedPositions={true}
            localPlayer={localPlayer}
            onClick={onClick}
        />
    )
}
