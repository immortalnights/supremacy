import { getPlatoonName } from "Game/platoonUtilities"
import { Platoon } from "../../entities"

function PlatoonItem({
    platoon,
    onClick,
}: {
    platoon?: Platoon
    onClick: (platoon: Platoon) => void
}) {
    const handleClick = () => {
        if (platoon) {
            onClick(platoon)
        }
    }

    return (
        <div
            role="button"
            style={{ display: "flex", gap: "0.25rem" }}
            onClick={handleClick}
        >
            <div
                style={{
                    border: "1px solid #004CAC",
                    width: "2.5rem",
                    height: "1rem",
                }}
            >
                {getPlatoonName(platoon)}
            </div>
            <div
                style={{
                    border: "1px solid #004CAC",
                    width: "2rem",
                    height: "1rem",
                }}
            >
                {platoon?.size}
            </div>
        </div>
    )
}

export default function PlatoonGrid({
    platoons,
    onClick,
    size = 24,
}: {
    platoons: Platoon[]
    onClick: (platoon: Platoon) => void
    size?: number
}) {
    const columns = Math.min(Math.max(size / 8, 1), 3)

    return (
        <div
            style={{
                display: "grid",
                gridTemplateRows: `repeat(${size / columns}, auto)`,
                gap: "2px 12px",
                gridAutoFlow: "column",
            }}
        >
            {Array(size)
                .fill(undefined)
                .map((_, index) => {
                    const platoon = platoons.find(
                        (item) => index === item.location.index,
                    )

                    return (
                        <PlatoonItem
                            key={`platoon-${index}`}
                            platoon={platoon}
                            onClick={onClick}
                        />
                    )
                })}
        </div>
    )
}
