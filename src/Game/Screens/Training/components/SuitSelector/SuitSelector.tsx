import { throwError } from "game-signaling-server/client"
import Button from "components/Button"
import { Platoon, PlatoonState, SuitClass, WeaponClass } from "Supremacy/entities"
import equipment from "Supremacy/data/equipment.json"
import suit1 from "/images/suit_1.png"
import suit2 from "/images/suit_2.png"
import suit3 from "/images/suit_3.png"
import suit4 from "/images/suit_4.gif"
import redLeft from "/images/red_left.png"
import redRight from "/images/red_right.png"
import { useMemo } from "react"
import { useTrainingActions } from "../../actions"
import { wrap } from "Game/utilities"

const images: { [key in SuitClass]: string } = {
    none: suit1,
    basic: suit2,
    moderate: suit3,
    advanced: suit4,
}

export default function SuitSelector({ platoon }: { platoon: Platoon }) {
    const { modifySuit } = useTrainingActions()

    const data =
        equipment.find((item) => item.id === platoon.suit) ??
        throwError(`Failed to find suit {suit}`)

    const suits = useMemo(
        () =>
            equipment
                .filter((item) => item.type === "suit")
                .sort((a, b) => a.power - b.power),
        [equipment],
    )

    const handlePreviousSuit = () => {
        if (platoon.state !== "training") {
            const currentIndex = suits.findIndex((item) => item.id === platoon.suit)
            const nextIndex = wrap(currentIndex - 1, suits.length)
            modifySuit(platoon, suits[nextIndex].id as SuitClass)
        }
    }

    const handleNextSuit = () => {
        if (platoon.state !== "training") {
            const currentIndex = suits.findIndex((item) => item.id === platoon.suit)
            const nextIndex = wrap(currentIndex + 1, suits.length)
            modifySuit(platoon, suits[nextIndex].id as SuitClass)
        }
    }

    return (
        <div style={{ padding: 12 }}>
            <div>
                {platoon.state === "equipped"
                    ? "Platoon wearing"
                    : `Suit Cost: ${data.cost} Cr.`}
            </div>
            <div
                style={{
                    background: "black",
                    width: 160,
                    height: 235,
                    margin: "2px 2px 5px",
                }}
            >
                <img src={images[platoon.suit]} />
            </div>
            <div>
                <Button onClick={handlePreviousSuit}>
                    <img src={redLeft} />
                </Button>
                <Button onClick={handleNextSuit}>
                    <img src={redRight} />
                </Button>
            </div>
        </div>
    )
}
