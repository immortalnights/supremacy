import Button from "components/Button"
import whiteUp from "/images/white_up.png"
import whiteDown from "/images/white_down.png"
import { Platoon } from "Game/entities"
import { getPlatoonName } from "Game/platoonUtilities"

export default function PlatoonSelector({
    platoon,
    onChangePlatoon,
}: {
    platoon: Platoon
    onChangePlatoon: (delta: number) => void
}) {
    const handleNextPlatoon = () => onChangePlatoon(1)
    const handlePreviousPlatoon = () => onChangePlatoon(-1)

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
            }}
        >
            <div>Platoon</div>
            <div
                style={{
                    background: "black",
                    padding: 2,
                    width: "3em",
                }}
            >
                {getPlatoonName(platoon)}
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: 42,
                }}
            >
                <Button onClick={handleNextPlatoon}>
                    <img src={whiteUp} />
                </Button>
                <Button onClick={handlePreviousPlatoon}>
                    <img src={whiteDown} />
                </Button>
            </div>
        </div>
    )
}
