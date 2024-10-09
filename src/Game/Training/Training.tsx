import Button from "../../components/Button"
import equipPlatoon from "/images/equip.png"
import disband from "/images/disband.png"
import whiteUp from "/images/white_up.png"
import whiteDown from "/images/white_down.png"
import Metadata, { MetadataValue } from "Game/components/Metadata"
import { MouseEvent, useState } from "react"
import { useCapitalPlanet } from "Game/hooks"
import { useModifyPlatoonTroops, useTrainingActions } from "./actions"
import { getModifierAmount, isColonizedPlanet, wrap } from "Game/utilities"
import { Platoon } from "Game/entities"
import { useAtomValue } from "jotai"
import { planetsAtom, platoonsAtom, sessionAtom } from "../store"
import PlatoonSelector from "./components/PlatoonSelector"
import Rank from "./components/Rank"
import Calibre from "./components/Calibre"
import WeaponSelector from "./components/WeaponSelector"
import SuitSelector from "./components/SuitSelector"

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

export default function Training() {
    const { localPlayer } = useAtomValue(sessionAtom)
    const capital = useCapitalPlanet()
    const [index, setIndex] = useState(0)
    const platoon = useAtomValue(platoonsAtom).find(
        (platoon) => platoon.index === index && platoon.owner === localPlayer,
    )
    // FIXME use a derived atom?
    const planet = useAtomValue(planetsAtom).find(
        (planet) =>
            isColonizedPlanet(planet) &&
            platoon?.state === "equipped" &&
            planet.id === platoon?.location.planet,
    )

    const { equip, dismiss } = useTrainingActions()

    if (!platoon) {
        throw Error(`Failed to find platoon ${index} for ${localPlayer}`)
    }

    const handleChangePlatoon = (delta: number) => {
        setIndex(wrap(index + delta, 24))
    }

    const handleEquipPlatoon = () => {
        if (platoon.state !== "equipped") {
            equip(platoon)
        }
    }

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
                <SuitSelector platoon={platoon} />
                <WeaponSelector platoon={platoon} />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: 240,
                    }}
                >
                    <div style={{ display: "flex" }}>
                        <Metadata
                            label="Location"
                            alignment="right"
                            value={planet?.name}
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
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 80,
                        }}
                    >
                        {platoon.state === "equipped"
                            ? "Platoon equipped!"
                            : "To equip platoon with your selected suit and weapon, will cost {cost} credits."}
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
