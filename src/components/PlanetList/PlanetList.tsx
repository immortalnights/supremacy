import type { Planet } from "../../Game/entities"
import Button from "../Button"

export default function PlanetList({
    planets,
    onClick,
}: {
    planets: Planet[]
    onClick: (planet: Planet) => void
}) {
    const cells = Array(32)
        .fill(undefined)
        .map((_, index) => {
            const planet = planets.find((p) => p.id === index)

            const handleClick = () => {
                if (planet) {
                    onClick(planet)
                }
            }

            let color = "#715fc3"
            if (planet) {
                if (planet.owner === "local") {
                    color = "green"
                } else {
                    color = "red"
                }
            }

            return (
                <td
                    key={planet?.id ?? index}
                    style={{
                        borderBottom: `2px solid ${color}`,
                        borderRight: `2px solid ${color}`,
                        width: "6em",
                        height: "1em",
                    }}
                >
                    {planet && (
                        <Button onClick={handleClick}>{planet.name}</Button>
                    )}
                </td>
            )
        })

    return (
        <table style={{ userSelect: "none" }}>
            <tbody>
                {Array(8)
                    .fill(undefined)
                    .map((_, index) => (
                        <tr>{cells.slice(index * 4, 4 + index * 4)}</tr>
                    ))}
            </tbody>
        </table>
    )
}
