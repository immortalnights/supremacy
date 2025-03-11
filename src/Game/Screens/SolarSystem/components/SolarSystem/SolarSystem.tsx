import { useMemo } from "react"
import "./styles.css"
import { Planet } from "Supremacy/entities"

function placeItems(height: number, count: number) {
    const topSpacing = 4
    const bottomSpacing = 4
    const minSpacing = 8

    const actualCount = Math.max(count, 2)

    // Calculate available space between top and bottom items
    const availableSpace = height - (topSpacing + bottomSpacing)

    // Calculate actual spacing between each additional item
    const actualSpacing = Math.max(minSpacing, availableSpace / (actualCount - 2 + 1))

    const positions = []

    // Place the top item
    positions.push(topSpacing)

    // Place the bottom item
    positions.push(height - bottomSpacing)

    // Place additional items
    let currentPos = topSpacing + actualSpacing
    for (let i = 0; i < actualCount - 2; i++) {
        const realPos = Math.max(
            currentPos + Math.random() * (actualSpacing - 3) - actualSpacing / 2,
            minSpacing,
        )
        positions.push(Math.round(realPos))
        currentPos += actualSpacing
    }

    // Sort the positions array
    positions.sort((a, b) => a - b)

    return positions
}

const getColor = (planet: Planet, localPlayer: string) => {
    let color
    if (planet.type === "lifeless") {
        color = "white"
    } else if (planet.owner === localPlayer) {
        color = "green"
    } else {
        color = "red"
    }

    return color
}

export default function SolarSystem({
    selected,
    planets,
    localPlayer,
}: {
    selected: number
    planets: Planet[]
    localPlayer: string
}) {
    const metrics = useMemo(() => {
        const positions = placeItems(255, planets.length)
        const amplitude = 80
        const frequency = (1 * Math.PI) / planets.length

        return positions.map(
            (position, index) =>
                ({
                    top: `${position}px`,
                    animationDelay: `-${Math.round(Math.random() * 100)}s`,
                    "--orbit-speed": `${Math.round(Math.random() * 12 + 2)}s`,
                    "--orbit-distance": `${Math.round(Math.sin(index * frequency) * amplitude + 20 * Math.random())}px`,
                }) as React.CSSProperties,
        )
    }, [planets.length])

    return (
        <div className="solar-system">
            {metrics.map((metrics, index) => (
                <div
                    key={`planet${index}`}
                    className="planet"
                    style={{
                        ...metrics,
                        backgroundColor: getColor(planets[index], localPlayer),
                    }}
                />
            ))}
        </div>
    )
}
