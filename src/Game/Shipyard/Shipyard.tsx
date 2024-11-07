import { FormEvent, useMemo, useState } from "react"
import { ColonizedPlanet, ShipBlueprint, ShipClass } from "../entities"
import battleship from "/images/ship-battle-cruiser.gif"
import solar from "/images/ship-solar-satellite.gif"
import atmos from "/images/ship-atmosphere-processor.gif"
import carrier from "/images/ship-cargo-carrier.gif"
import mining from "/images/ship-mining-station.gif"
import horticultural from "/images/ship-horticultural.gif"
import catalog from "../data/ships.json"
import { dateAtom, sessionAtom, shipsAtom } from "../store"
import { atom, useAtomValue } from "jotai"
import { usePurchaseShip } from "./actions"
import { useCapitalPlanet } from "../hooks"
import Button from "components/Button"
import { wrap } from "Game/utilities"
import { canPurchaseAtmos } from "Game/utilities/ships"
import Screen from "Game/components/Screen"

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
        <div>
            <form onSubmit={handleBuy}>
                <input type="text" value={name} onChange={handleChange} autoFocus />
                <Button type="submit">Buy</Button>
                <Button type="button" onClick={onCancel}>
                    Cancel
                </Button>
            </form>
        </div>
    )
}

export default function Shipyard() {
    const { localPlayer } = useAtomValue(sessionAtom)
    const planet = useCapitalPlanet()
    const [index, setIndex] = useState(0)
    const blueprint = catalog[index] as ShipBlueprint
    const [purchasing, setPurchasing] = useState(false)
    const date = useAtomValue(dateAtom)
    const ownedAtom = useMemo(
        () =>
            atom(
                (get) =>
                    get(shipsAtom).filter(
                        (s) => s.owner === localPlayer && s.class === blueprint.class,
                    ).length,
            ),
        [localPlayer, blueprint.class],
    )
    const owned = useAtomValue(ownedAtom)

    const handlePrevious = () => {
        setIndex(wrap(index - 1, catalog.length))
    }
    const handleNext = () => {
        setIndex(wrap(index + 1, catalog.length))
    }
    const handleBuy = () => {
        if (
            blueprint.class !== "Atmosphere Processor" ||
            canPurchaseAtmos(date, owned)
        ) {
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
        <Screen flexDirection="column">
            <div style={{ background: "black", width: 640, height: 282 }}>
                <img src={images[blueprint.class]} />
            </div>
            <div>
                <div style={{ display: "flex" }}>
                    <Button onClick={handlePrevious} style={{ padding: 5 }}>
                        &lt;&lt;
                    </Button>
                    <Button style={{ padding: 5 }} onClick={handleBuy}>
                        Buy
                    </Button>
                    <div style={{ flexGrow: 1 }}>
                        {purchasing ? (
                            <PurchaseShip
                                ship={blueprint}
                                planet={planet}
                                owned={owned}
                                onPurchased={handlePurchased}
                                onCancel={handleCancel}
                            />
                        ) : (
                            <>
                                <div>{blueprint.description}</div>
                                <div>Type: {blueprint.class}</div>
                            </>
                        )}
                    </div>
                    <Button onClick={handleNext} style={{ padding: 5 }}>
                        &gt;&gt;
                    </Button>
                </div>
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
                        <div>{blueprint.cost.credits}: Credits</div>
                        <div>{blueprint.cost.minerals}: Minerals</div>
                        <div>{blueprint.cost.energy}: Energy</div>
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
            </div>
        </Screen>
    )
}
