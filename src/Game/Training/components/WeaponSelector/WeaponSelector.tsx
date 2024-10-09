import { throwError } from "game-signaling-server/client"
import Button from "components/Button"
import { Platoon, WeaponClass } from "Game/entities"
import equipment from "Game/data/equipment.json"
import weapon1 from "/images/weapon_1.png"
import weapon2 from "/images/weapon_2.png"
import weapon3 from "/images/weapon_3.png"
import redLeft from "/images/red_left.png"
import redRight from "/images/red_right.png"
import { useTrainingActions } from "Game/Training/actions"
import { useMemo } from "react"
import { wrap } from "Game/utilities"

const images: { [key in WeaponClass]: string } = {
    rifle: weapon1,
    flamethrower: weapon2,
    mortar: weapon3,
}

export default function WeaponSelector({ platoon }: { platoon: Platoon }) {
    const { modifyWeapon } = useTrainingActions()

    const data =
        equipment.find((item) => item.id === platoon.weapon) ??
        throwError(`Failed to find weapon {weapon}`)

    const weapons = useMemo(
        () =>
            equipment
                .filter((item) => item.type === "weapon")
                .sort((a, b) => a.power - b.power),
        [equipment],
    )

    const handlePreviousWeapon = () => {
        if (platoon.state !== "training") {
            const currentIndex = weapons.findIndex(
                (item) => item.id === platoon.weapon,
            )
            const nextIndex = wrap(currentIndex - 1, weapons.length)
            modifyWeapon(platoon, weapons[nextIndex].id as WeaponClass)
        }
    }

    const handleNextWeapon = () => {
        if (platoon.state !== "training") {
            const currentIndex = weapons.findIndex(
                (item) => item.id === platoon.weapon,
            )
            const nextIndex = wrap(currentIndex + 1, weapons.length)
            modifyWeapon(platoon, weapons[nextIndex].id as WeaponClass)
        }
    }

    return (
        <div style={{ padding: 12 }}>
            <div>
                {platoon.state === "equipped"
                    ? "Carrying"
                    : `Weapon Cost: ${data.cost} Cr.`}
            </div>
            <div
                style={{
                    background: "black",
                    width: 160,
                    height: 235,
                    margin: "2px 2px 5px",
                }}
            >
                <img src={images[platoon.weapon]} />
            </div>
            <div>
                <Button onClick={handlePreviousWeapon}>
                    <img src={redLeft} />
                </Button>
                <Button onClick={handleNextWeapon}>
                    <img src={redRight} />
                </Button>
            </div>
        </div>
    )
}
