import { throwError } from "game-signaling-server/client"
import Button from "components/Button"
import { SuitClass } from "Game/entities"
import equipment from "Game/data/equipment.json"
import suit1 from "/images/suit_1.png"
import suit2 from "/images/suit_2.png"
import suit3 from "/images/suit_3.png"
import suit4 from "/images/suit_4.gif"
import redLeft from "/images/red_left.png"
import redRight from "/images/red_right.png"

const images: { [key in SuitClass]: string } = {
    none: suit1,
    basic: suit2,
    moderate: suit3,
    advanced: suit4,
}

export default function SuitSelector({
    suit,
    onPrevious,
    onNext,
}: {
    suit: SuitClass
    onPrevious: () => void
    onNext: () => void
}) {
    const data =
        equipment.find((item) => item.id === suit) ??
        throwError(`Failed to find suit {suit}`)

    return (
        <div style={{ padding: 12 }}>
            <div>Suit Cost: {data.cost} Cr.</div>
            <div
                style={{
                    background: "black",
                    width: 160,
                    height: 235,
                    margin: "2px 2px 5px",
                }}
            >
                <img src={images[suit]} />
            </div>
            <div>
                <Button onClick={onPrevious}>
                    <img src={redLeft} />
                </Button>
                <Button onClick={onNext}>
                    <img src={redRight} />
                </Button>
            </div>
        </div>
    )
}
