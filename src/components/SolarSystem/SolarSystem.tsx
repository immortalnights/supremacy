import "./styles.css"

function placeItems(height: number, count: number) {
    const topSpacing = 4
    const bottomSpacing = 4
    const minSpacing = 8

    const actualCount = Math.max(count, 2)

    // Calculate available space between top and bottom items
    const availableSpace = height - (topSpacing + bottomSpacing)

    // Calculate actual spacing between each additional item
    const actualSpacing = Math.max(
        minSpacing,
        availableSpace / (actualCount - 2 + 1),
    )

    // Initialize an array to store the positions of all items
    let positions = []

    // Place the top item
    positions.push(topSpacing)

    // Place the bottom item
    positions.push(height - bottomSpacing)

    // Place additional items
    let currentPos = topSpacing + actualSpacing
    for (let i = 0; i < actualCount - 2; i++) {
        let realPos = Math.max(
            currentPos +
                Math.random() * (actualSpacing - 3) -
                actualSpacing / 2,
            minSpacing,
        )
        positions.push(Math.round(realPos))
        currentPos += actualSpacing
    }

    // Sort the positions array
    positions.sort((a, b) => a - b)

    return positions
}

export default ({ planets = 8 }: { planets: number }) => {
    const positions = placeItems(260, planets)
    const amplitude = 80
    const frequency = (1 * Math.PI) / planets

    return (
        <div className="solar-system">
            {positions.map((position, index) => (
                <div
                    className="planet"
                    style={
                        {
                            top: `${position}px`,
                            "animation-delay": `-${Math.round(Math.random() * 100)}s`,
                            "--orbit-speed": `${Math.round(Math.random() * 12 + 2)}s`,
                            "--orbit-distance": `${Math.round(Math.sin(index * frequency) * amplitude + 20 * Math.random())}px`,
                        } as React.CSSProperties
                    }
                ></div>
            ))}
        </div>
    )
}
