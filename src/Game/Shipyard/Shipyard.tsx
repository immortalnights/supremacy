import { FormEvent, useState } from "react"
import Button from "../../components/Button"
import { ColonizedPlanet, Planet, Ship } from "../entities"
import battleship from "/images/battleship.gif"
import solar from "/images/solar.gif"
import catalog from "../../data/ships.json"
import { selectedPlanetAtom } from "../store"
import { useAtomValue } from "jotai"
import { usePurchaseShip } from "../../commands"

const shipTypes: string[] = Object.keys(catalog)

const images: { [key: (typeof shipTypes)[number]]: string } = {
    battlecruiser: battleship,
    generator: solar,
    atmos: battleship,
    carrier: battleship,
    miningstation: battleship,
    horticultural: battleship,
}

function PurchaseShip({
    type,
    planet,
    owned,
    onPurchased,
    onCancel,
}: {
    type: string
    planet: ColonizedPlanet
    owned: number
    onPurchased: () => void
    onCancel: () => void
}) {
    const purchase = usePurchaseShip()
    const [name, setName] = useState(`${type}${owned}`)

    const handleChange = () => {}

    const handleBuy = (ev: FormEvent) => {
        ev.preventDefault()
        purchase(type, planet, name)
        onPurchased()
    }

    return (
        <div>
            <form onSubmit={handleBuy}>
                <input type="text" value={name} onChange={handleChange} />
                <Button type="submit">Buy</Button>
                <Button type="button" onClick={onCancel}>
                    Cancel
                </Button>
            </form>
        </div>
    )
}

export default function Shipyard() {
    const planet = useAtomValue(selectedPlanetAtom) as ColonizedPlanet
    const [index, setIndex] = useState(0)
    const ship = catalog[shipTypes[index]]
    const [purchasing, setPurchasing] = useState(false)
    const owned = 0

    const handlePrevious = () => {
        setIndex((index - 1 + shipTypes.length) % shipTypes.length)
    }
    const handleNext = () => {
        setIndex((index + 1) % shipTypes.length)
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
            <img src={images[shipTypes[index]]} />
            <div>
                <div style={{ display: "flex" }}>
                    <Button onClick={handlePrevious} style={{ padding: 5 }}>
                        &lt;&lt;
                    </Button>
                    <Button style={{ padding: 5 }} onClick={handleBuy}>
                        Buy
                    </Button>
                    <div style={{ flexGrow: 1 }}>
                        {purchasing && (
                            <PurchaseShip
                                type={shipTypes[index]}
                                planet={planet}
                                owned={owned}
                                onPurchased={handlePurchased}
                                onCancel={handleCancel}
                            />
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
                        <div>{planet.credits}: Credits</div>
                        <div>{planet.minerals}: Minerals</div>
                        <div>{planet.energy}: Energy</div>
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
                        <div>{ship.cargoCapacity}: Payload</div>
                        <div>{ship.fuelCapacity}: Fuel</div>
                    </div>
                    <div>
                        <div>
                            <strong>Data</strong>
                        </div>
                        <div>{owned}: Owned</div>
                        <div>{ship.range}: Range</div>
                        <div>{ship.civilianCapacity}: Seats</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
