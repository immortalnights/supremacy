import { throwError } from "game-signaling-server/client"
import Button from "components/Button"
import { WeaponClass } from "Game/entities"
import equipment from "Game/data/equipment.json"
import weapon1 from "/images/weapon_1.png"
import weapon2 from "/images/weapon_2.png"
import weapon3 from "/images/weapon_3.png"
import redLeft from "/images/red_left.png"
import redRight from "/images/red_right.png"

const images: { [key in WeaponClass]: string } = {
    rifle: weapon1,
    flamethrower: weapon2,
    mortar: weapon3,
}

export default function WeaponSelector({
    weapon,
    onPrevious,
    onNext,
}: {
    weapon: WeaponClass
    onPrevious: () => void
    onNext: () => void
}) {
    const data =
        equipment.find((item) => item.id === weapon) ??
        throwError(`Failed to find weapon {weapon}`)

    return (
        <div style={{ padding: 12 }}>
            <div>Weapon Cost: {data.cost} Cr.</div>
            <div
                style={{
                    background: "black",
                    width: 160,
                    height: 235,
                    margin: "2px 2px 5px",
                }}
            >
                <img src={images[weapon]} />
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
