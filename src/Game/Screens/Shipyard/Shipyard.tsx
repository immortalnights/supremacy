import { FormEvent, useCallback, useMemo, useState } from "react"
import { ColonizedPlanet, ShipBlueprint, ShipClass } from "Supremacy/entities"
import battleship from "/images/ship-battle-cruiser.gif"
import solar from "/images/ship-solar-satellite.gif"
import atmos from "/images/ship-atmosphere-processor.gif"
import carrier from "/images/ship-cargo-carrier.gif"
import mining from "/images/ship-mining-station.gif"
import horticultural from "/images/ship-horticultural.gif"
import catalog from "Supremacy/data/ships.json"
import { dateAtom, sessionAtom, shipsAtom, shipsDocketAtPlanetAtom } from "../../store"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { usePurchaseShip } from "./actions"
import { useCapitalPlanet } from "../../hooks"
import Button from "components/Button"
import { wrap } from "Game/utilities"
import { canPurchaseAtmos } from "Supremacy/ships"
import Screen from "Game/components/Screen"
import Notification from "Game/components/Notification"
import {
    useNotification,
    useSetNotification,
} from "Game/components/Notification/useNotification"
import previousIcon from "/images/blue_previous.png"
import buyIcon from "/images/blue_buy.png"
import nextIcon from "/images/blue_next.png"

const images: { [key in ShipClass]: string } = {
    "B-29 Battle Cruiser": battleship,
    "Solar-Satellite Generator": solar,
    "Atmosphere Processor": atmos,
    "Cargo Store / Carrier": carrier,
    "Core Mining Station": mining,
    "Horticultural Station": horticultural,
}

function PurchaseShip({
    ship,
    planet,
    owned,
    onPurchased,
    onCancel,
}: {
    ship: ShipBlueprint
    planet: ColonizedPlanet
    owned: number
    onPurchased: () => void
    onCancel: () => void
}) {
    const purchase = usePurchaseShip()
    const [name] = useState(`${ship.shortName}${owned}`)

    const handleChange = () => {}

    const handleBuy = (ev: FormEvent) => {
        ev.preventDefault()
        // FIXME send whole ship data?
        purchase(ship, planet, name)
        onPurchased()
    }

    return (
        <form onSubmit={handleBuy}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                }}
            >
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={handleChange}
                        autoFocus
                        style={{ margin: 5 }}
                    />
                </label>
                <Button type="submit">Buy</Button>
                <Button type="button" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}

const useOwnedShipCount = (player: string, shipClass: ShipClass) => {
    const ownedAtom = useMemo(
        () =>
            atom(
                (get) =>
                    get(shipsAtom).filter(
                        (s) => s.owner === player && s.class === shipClass,
                    ).length,
            ),
        [player, shipClass],
    )
    return useAtomValue(ownedAtom)
}

function Details({ blueprint }: { blueprint: ShipBlueprint }) {
    const notification = useNotification()
    const [alert] = useState(false)

    return (
        <div style={{ textAlign: "left", fontSize: "75%" }}>
            {notification ? <Notification /> : <div>{blueprint.description}</div>}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                Type: {blueprint.class}{" "}
                {alert ? <div>** Incoming Message **</div> : null}
            </div>
        </div>
    )
}

function Controls({
    planet,
    blueprint,
    onChange,
}: {
    planet: ColonizedPlanet
    blueprint: ShipBlueprint
    onChange: (change: -1 | 1) => void
}) {
    const { localPlayer } = useAtomValue(sessionAtom)
    const [purchasing, setPurchasing] = useState(false)
    const owned = useOwnedShipCount(localPlayer, blueprint?.class)
    const dockedShips = useAtomValue(shipsDocketAtPlanetAtom).filter(planet)
    const date = useAtomValue(dateAtom)
    const notify = useSetNotification()

    const handlePrevious = () => {
        setPurchasing(false)
        onChange(-1)
    }

    const handleNext = () => {
        setPurchasing(false)
        onChange(1)
    }

    const handleBuy = () => {
        if (
            blueprint.class === "Atmosphere Processor" &&
            !canPurchaseAtmos(date, owned)
        ) {
        } else if (dockedShips.length >= 3) {
            notify(`There is no room in the docking bays on ${planet.name}`)
        } else if (planet.credits < blueprint.cost.credits) {
            notify(`You do not have enough credits`)
        } else {
            notify("This ship has been transferred into a docking bay")
            setPurchasing(true)
        }
    }

    const handlePurchased = () => {
        setPurchasing(false)
    }

    const handleCancel = () => {
        setPurchasing(false)
    }

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button
                onClick={handlePrevious}
                style={{ margin: "0 1px 0 0", display: "flex" }}
            >
                <img src={previousIcon} alt="Previous" />
            </Button>
            <Button onClick={handleBuy} style={{ margin: 1, display: "flex" }}>
                <img src={buyIcon} alt="Buy" />
            </Button>
            <div style={{ flexGrow: 1, padding: "0 4px" }}>
                {purchasing ? (
                    <PurchaseShip
                        ship={blueprint}
                        planet={planet}
                        owned={owned}
                        onPurchased={handlePurchased}
                        onCancel={handleCancel}
                    />
                ) : (
                    <Details blueprint={blueprint} />
                )}
            </div>
            <Button
                onClick={handleNext}
                style={{ margin: "0 0 0 1px", display: "flex" }}
            >
                <img src={nextIcon} alt="Next" />
            </Button>
        </div>
    )
}

export default function Shipyard() {
    const { localPlayer } = useAtomValue(sessionAtom)
    const planet = useCapitalPlanet()
    const [index, setIndex] = useState(0)
    const blueprint = catalog[index] as ShipBlueprint
    const owned = useOwnedShipCount(localPlayer, blueprint?.class)

    const handleChangeIndex = (change: number) => {
        setIndex(wrap(index + change, catalog.length))
    }

    return (
        <Screen flexDirection="column">
            <div
                style={{
                    background: "black",
                    width: 640,
                    height: 282,
                    flexShrink: 0,
                }}
            >
                <img src={images[blueprint.class]} />
            </div>
            <Controls
                planet={planet}
                blueprint={blueprint}
                onChange={handleChangeIndex}
            />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                    <div>
                        <strong>{planet.name}</strong>
                    </div>
                    <div>{Math.floor(planet.credits)}: Credits</div>
                    <div>{Math.floor(planet.minerals)}: Minerals</div>
                    <div>{Math.floor(planet.energy)}: Energy</div>
                </div>
                <div>
                    <div>
                        <strong>Cost</strong>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            width: 140,
                            gap: 5,
                        }}
                    >
                        <div>{blueprint.cost.credits}</div>
                        <div>:Credits</div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            width: 140,
                            gap: 5,
                        }}
                    >
                        <div>{blueprint.cost.minerals}</div>
                        <div>:Minerals</div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            width: 140,
                            gap: 5,
                        }}
                    >
                        <div>{blueprint.cost.energy}</div>
                        <div>:Energy</div>
                    </div>
                </div>
                <div>
                    <div>
                        <strong>Capacity</strong>
                    </div>
                    <div>{blueprint.requiredCrew}: Crew</div>
                    <div>{blueprint.capacity.cargo}: Payload</div>
                    <div>
                        {blueprint.capacity.fuels > 0
                            ? blueprint.capacity.fuels
                            : "Nuclear"}
                        : Fuel
                    </div>
                </div>
                <div>
                    <div>
                        <strong>Data</strong>
                    </div>
                    <div>{owned}: Owned</div>
                    <div>
                        {blueprint.range > 0 ? blueprint.range : "Infinite"}: Range
                    </div>
                    <div>{blueprint.capacity.civilians}: Seats</div>
                </div>
            </div>
        </Screen>
    )
}
