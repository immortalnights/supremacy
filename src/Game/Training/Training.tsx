import Button from "../../components/Button"
import equip from "/images/equip.png"
import disband from "/images/disband.png"
import suit1 from "/images/suit_1.png"
import weapon1 from "/images/weapon_1.png"
import whiteUp from "/images/white_up.png"
import whiteDown from "/images/white_down.png"
import redLeft from "/images/red_left.png"
import redRight from "/images/red_right.png"
import training_calibre from "/images/training_calibre.png"
import training_fast from "/images/training_fast.gif"
import training_medium from "/images/training_medium.gif"
import training_slow from "/images/training_slow.gif"
import Metadata, { MetadataValue } from "../../components/Metadata"
import { useMemo, useState } from "react"
import { useCapitalPlanet } from "../dataHooks"

const suffixes = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"],
])

const calibre = {
    paused: training_calibre,
    fast: training_fast,
    medium: training_medium,
    slow: training_slow,
}

function PlatoonSelector({
    platoon,
    onChangePlatoon,
}: {
    platoon: number
    onChangePlatoon: (delta: number) => void
}) {
    const ordinal = useMemo(() => {
        const pr = new Intl.PluralRules("en-US", { type: "ordinal" })
        const formatOrdinals = (value: number) => {
            const rule = pr.select(value)
            const suffix = suffixes.get(rule)
            return `${value}${suffix}`
        }
        return formatOrdinals(platoon)
    }, [platoon])

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
                {ordinal}
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

function PlatoonTroops() {
    const handleHireTroops = () => {}
    const handleDismissTroops = () => {}

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
                0
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

function ArmourSelector() {
    const handlePreviousArmour = () => {}
    const handleNextArmour = () => {}

    return (
        <div style={{ padding: 12 }}>
            <div>Suit Cost: 0 Cr.</div>
            <div>
                <img src={suit1} />
            </div>
            <div>
                <Button onClick={handlePreviousArmour}>
                    <img src={redLeft} />
                </Button>
                <Button onClick={handleNextArmour}>
                    <img src={redRight} />
                </Button>
            </div>
        </div>
    )
}

function WeaponSelector() {
    const handlePreviousWeapon = () => {}
    const handleNextWeapon = () => {}

    return (
        <div style={{ padding: 12 }}>
            <div>Suit Cost: 0 Cr.</div>
            <div>
                <img src={weapon1} />
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

export default function Training() {
    const capital = useCapitalPlanet()
    const [platoon, setPlatoon] = useState(1)

    const handleChangePlatoon = (delta: number) => {
        let index = platoon + delta
        if (index > 24) {
            index = 1
        } else if (index < 1) {
            index = 24
        }
        setPlatoon(index)
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
                <PlatoonTroops />
                <PlanetCivilians civilians={capital.population} />
            </div>
            <div style={{ display: "flex", padding: 6 }}>
                <ArmourSelector />
                <WeaponSelector />

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
                        <Metadata label="Rank" alignment="right" value={""} />
                    </div>
                    <div style={{ maxWidth: "240px" }}>
                        To equip platoon with your selected suit and weapon,
                        will cost {0} credits.
                    </div>
                    <div>{/* message */}</div>
                    <div>
                        <Button onClick={handleEquipPlatoon}>
                            <img src={equip} />
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
                            <img src={calibre.paused} />
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
