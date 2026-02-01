import Button from "components/Button"
import blueUp from "/images/blue_up.png"
import blueDown from "/images/blue_down.png"
import aggression25 from "/images/aggression_25.png"
import aggression50 from "/images/aggression_50.png"
import aggression75 from "/images/aggression_75.png"
import aggression100 from "/images/aggression_100.png"

const imageMap = {
    25: aggression25,
    50: aggression50,
    75: aggression75,
    100: aggression100,
} as const

function getImage(value: number) {
    // Define the target points
    const points = [25, 50, 75, 100] as (keyof typeof imageMap)[]

    // Find the nearest point
    const nearestPoint = points.reduce((prev, curr) => {
        return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    })

    return imageMap[nearestPoint]
}

export default function CombatAggression({
    aggression,
    onIncrease,
    onDecrease,
}: {
    aggression: number
    onIncrease: () => void
    onDecrease: () => void
}) {
    return (
        <div>
            <div style={{ textAlign: "center" }}>Aggression</div>
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <Button onClick={onIncrease}>
                        <img src={blueUp} />
                    </Button>
                    <Button onClick={onDecrease}>
                        <img src={blueDown} />
                    </Button>
                </div>
                <img src={getImage(aggression)} />
                <div
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        writingMode: "vertical-lr",
                        textOrientation: "upright",
                        textAlign: "center",
                    }}
                >
                    {aggression}%
                </div>
            </div>
        </div>
    )
}
