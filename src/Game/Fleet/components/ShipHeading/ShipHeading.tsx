import { Planet, Ship } from "Game/entities"
import Metadata from "Game/components/Metadata"
import { useAtomValue } from "jotai"
import { planetsAtom } from "Game/store"

export default function ShipHeading({ ship }: { ship?: Ship }) {
    const planets = useAtomValue(planetsAtom)

    let name: string | undefined
    let from: string | undefined
    let to: string | undefined
    let eta: number | undefined
    let fuels: number | string | undefined
    let destination: Planet | undefined
    let source: Planet | undefined
    if (ship && ship.position === "outer-space") {
        ;({ name, fuels } = ship)
        ;({ from, to, remaining: eta } = ship.heading)

        if (to) {
            destination = planets.find((planet) => planet.id === to)
        }

        if (from) {
            source = planets.find((planet) => planet.id === from)
        }
    }

    return (
        <div>
            Heading
            <div>
                <Metadata label="Ship" value={name} />
                <Metadata label="From" value={source?.name} />
                <Metadata label="To" value={destination?.name} />
                <Metadata label="ETA" value={eta} />
                <Metadata label="Fuel" value={fuels} />
            </div>
        </div>
    )
}
