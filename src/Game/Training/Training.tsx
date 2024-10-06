import Button from "../../components/Button"
import equipPlatoon from "/images/equip.png"
import disband from "/images/disband.png"
import suit1 from "/images/suit_1.png"
import suit2 from "/images/suit_2.png"
import suit3 from "/images/suit_3.png"
import suit4 from "/images/suit_4.gif"
import weapon1 from "/images/weapon_1.png"
import weapon2 from "/images/weapon_2.png"
import weapon3 from "/images/weapon_3.png"
import whiteUp from "/images/white_up.png"
import whiteDown from "/images/white_down.png"
import redLeft from "/images/red_left.png"
import redRight from "/images/red_right.png"
import Metadata, { MetadataValue } from "Game/components/Metadata"
import { MouseEvent, useMemo, useState } from "react"
import { useCapitalPlanet } from "Game/hooks"
import { useModifyPlatoonTroops, useTrainingActions } from "./actions"
import { getModifierAmount, wrap } from "Game/utilities"
import { Platoon, PlatoonState, SuitClass, WeaponClass } from "Game/entities"
import { useAtomValue } from "jotai"
import { platoonsAtom, sessionAtom } from "../store"
import equipment from "Game/data/equipment.json"
import { throwError } from "game-signaling-server/client"
import PlatoonSelector from "./components/PlatoonSelector"
import Rank from "./components/Rank"
import Calibre from "./components/Calibre"

type EquipmentType = SuitClass | WeaponClass

const images: { [key in EquipmentType]: string } = {
    none: suit1,
    basic: suit2,
    moderate: suit3,
    advanced: suit4,
    rifle: weapon1,
    flamethrower: weapon2,
    mortar: weapon3,
}

function PlatoonTroops({ platoon }: { platoon: Platoon }) {
    const modifyTroops = useModifyPlatoonTroops()

    const handleHireTroops = (event: MouseEvent) => {
        modifyTroops(platoon, getModifierAmount(event, 200))
    }

    const handleDismissTroops = (event: MouseEvent) => {
        modifyTroops(platoon, -getModifierAmount(event, 200))
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div>Troops</div>
            <div
                style={{
                    background: "black",
                    padding: 2,
                    width: "3em",
                }}
            >
                {platoon.size}
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: 42,
                }}
            >
                <Button onClick={handleHireTroops}>
                    <img src={whiteUp} />
                </Button>
                <Button onClick={handleDismissTroops}>
                    <img src={whiteDown} />
                </Button>
            </div>
        </div>
    )
}

function PlanetCivilians({ civilians }: { civilians: number }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div>Civilians</div>
            <div
                style={{
                    background: "black",
                    padding: 2,
                    width: "3em",
                }}
            >
                {Math.floor(civilians)}
            </div>
        </div>
    )
}

function ArmourSelector({
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

function WeaponSelector({
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

export default function Training() {
    const suits = useMemo(
        () =>
            equipment
                .filter((item) => item.type === "suit")
                .sort((a, b) => a.power - b.power),
        [equipment],
    )
    const weapons = useMemo(
        () =>
            equipment
                .filter((item) => item.type === "weapon")
                .sort((a, b) => a.power - b.power),
        [equipment],
    )
    const { localPlayer } = useAtomValue(sessionAtom)
    const capital = useCapitalPlanet()
    const [index, setIndex] = useState(0)
    const platoon = useAtomValue(platoonsAtom).find(
        (platoon) => platoon.index === index && platoon.owner === localPlayer,
    )
    const suit = platoon?.suit ?? "none"
    const weapon = platoon?.weapon ?? "rifle"

    const { modifySuit, modifyWeapon, equip, dismiss } = useTrainingActions()

    if (!platoon) {
        throw Error(`Failed to find platoon ${index} for ${localPlayer}`)
    }

    const cost =
        platoon.size *
        ((equipment.find((item) => item.id === platoon.suit)?.cost ?? 0) +
            (equipment.find((item) => item.id === platoon.weapon)?.cost ?? 0))

    const handleChangePlatoon = (delta: number) => {
        setIndex(wrap(index + delta, 24))
    }

    const handleNextSuit = () => {
        if (platoon.state !== "training") {
            const currentIndex = suits.findIndex((item) => item.id === suit)
            const nextIndex = wrap(currentIndex + 1, suits.length)
            modifySuit(platoon, suits[nextIndex].id as SuitClass)
        }
    }

    const handlePreviousSuit = () => {
        if (platoon.state !== "training") {
            const currentIndex = suits.findIndex((item) => item.id === suit)
            const nextIndex = wrap(currentIndex - 1, suits.length)
            modifySuit(platoon, suits[nextIndex].id as SuitClass)
        }
    }

    const handleNextWeapon = () => {
        if (platoon.state !== "training") {
            const currentIndex = weapons.findIndex((item) => item.id === weapon)
            const nextIndex = wrap(currentIndex + 1, weapons.length)
            modifyWeapon(platoon, weapons[nextIndex].id as WeaponClass)
        }
    }

    const handlePreviousWeapon = () => {
        if (platoon.state !== "training") {
            const currentIndex = weapons.findIndex((item) => item.id === weapon)
            const nextIndex = wrap(currentIndex - 1, weapons.length)
            modifyWeapon(platoon, weapons[nextIndex].id as WeaponClass)
        }
    }

    const handleEquipPlatoon = () => {}

    const handleDismissPlatoon = () => {}

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    padding: 6,
                    justifyContent: "space-around",
                }}
            >
                <PlatoonSelector
                    platoon={platoon}
                    onChangePlatoon={handleChangePlatoon}
                />
                <PlatoonTroops platoon={platoon} />
                <PlanetCivilians civilians={capital.population} />
            </div>
            <div style={{ display: "flex", padding: 6 }}>
                <ArmourSelector
                    suit={suit}
                    onNext={handleNextSuit}
                    onPrevious={handlePreviousSuit}
                />
                <WeaponSelector
                    weapon={weapon}
                    onNext={handleNextWeapon}
                    onPrevious={handlePreviousWeapon}
                />

                <div>
                    <div style={{ display: "flex" }}>
                        <Metadata
                            label="Location"
                            alignment="right"
                            value={""}
                        />
                    </div>
                    <div style={{ display: "flex" }}>
                        <Metadata
                            label="Credits"
                            alignment="right"
                            value={capital.credits}
                            format={Math.floor}
                        />
                    </div>
                    <div style={{ display: "flex" }}>
                        <Rank state={platoon.state} calibre={platoon.calibre} />
                    </div>
                    <div style={{ maxWidth: "240px" }}>
                        To equip platoon with your selected suit and weapon,
                        will cost {cost} credits.
                    </div>
                    <div>{/* message */}</div>
                    <div>
                        <Button onClick={handleEquipPlatoon}>
                            <img src={equipPlatoon} />
                        </Button>
                        <Button onClick={handleDismissPlatoon}>
                            <img src={disband} />
                        </Button>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 6,
                        }}
                    >
                        Calibre
                        <div>
                            <Calibre
                                state={platoon.state}
                                calibre={platoon.calibre}
                            />
                            <MetadataValue
                                label="Calibre"
                                value={"0"}
                                postfix="%"
                                style={{
                                    maxWidth: "3em",
                                    backgroundColor: "black",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
