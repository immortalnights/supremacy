import { FormEvent, useMemo, useState } from "react"
import Button from "../../components/Button"
import { ColonizedPlanet, ShipBlueprint, ShipClass } from "../entities"
import battleship from "/images/battleship.gif"
import solar from "/images/solar.gif"
import catalog from "../../data/ships.json"
import { sessionAtom, shipsAtom } from "../store"
import { atom, useAtomValue } from "jotai"
import { usePurchaseShip } from "../../commands"
import { useCapitalPlanet } from "../dataHooks"

const images: { [key in ShipClass]: string } = {
    "B-29 Battle Cruiser": battleship,
    "Solar-Satellite Generator": solar,
    "Atmosphere Processor": battleship,
    "Cargo Store / Carrier": battleship,
    "Core Mining Station": battleship,
    "Horticultural Station": battleship,
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
                <input
                    type="text"
                    value={name}
                    onChange={handleChange}
                    autoFocus
                />
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
    const ship = catalog[index]
    const [purchasing, setPurchasing] = useState(false)
    const ownedAtom = useMemo(
        () =>
            atom(
                (get) =>
                    get(shipsAtom).filter(
                        (s) =>
                            s.owner === localPlayer && s.class === ship.class,
                    ).length,
            ),
        [localPlayer, ship.class],
    )
    const owned = useAtomValue(ownedAtom)

    const handlePrevious = () => {
        setIndex((index - 1 + catalog.length) % catalog.length)
    }
    const handleNext = () => {
        setIndex((index + 1) % catalog.length)
    }
    const handleBuy = () => {
        setPurchasing(true)
    }
    const handlePurchased = () => {
        setPurchasing(false)
    }
    const handleCancel = () => {
        setPurchasing(false)
    }

    return (
        <div>
            <img src={images[ship.class]} />
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
                                ship={ship}
                                planet={planet}
                                owned={owned}
                                onPurchased={handlePurchased}
                                onCancel={handleCancel}
                            />
                        ) : (
                            <>
                                <div>{ship.description}</div>
                                <div>Type: {ship.class}</div>
                            </>
                        )}
                    </div>
                    <Button onClick={handleNext} style={{ padding: 5 }}>
                        &gt;&gt;
                    </Button>
                </div>
                <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                >
                    <div>
                        <div>
                            <strong>Starbase</strong>
                        </div>
                        <div>{Math.floor(planet.credits)}: Credits</div>
                        <div>{Math.floor(planet.minerals)}: Minerals</div>
                        <div>{Math.floor(planet.energy)}: Energy</div>
                    </div>
                    <div>
                        <div>
                            <strong>Cost</strong>
                        </div>
                        <div>{ship.cost.credits}: Credits</div>
                        <div>{ship.cost.minerals}: Minerals</div>
                        <div>{ship.cost.energy}: Energy</div>
                    </div>
                    <div>
                        <div>
                            <strong>Capacity</strong>
                        </div>
                        <div>{ship.requiredCrew}: Crew</div>
                        <div>{ship.capacity.cargo}: Payload</div>
                        <div>
                            {ship.capacity.fuels > 0
                                ? ship.capacity.fuels
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
                            {ship.range > 0 ? ship.range : "Infinite"}: Range
                        </div>
                        <div>{ship.capacity.civilians}: Seats</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
