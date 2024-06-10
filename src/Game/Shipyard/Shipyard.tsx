import { useState } from "react"
import Button from "../../components/Button"
import { Planet, Ship } from "../entities"
import battleship from "/images/battleship.gif"
import solar from "/images/solar.gif"

const catalog = [
    {
        id: "battleship",
        img: battleship,
        class: "battle",
        cost: {
            credits: 5250,
            minerals: 95,
            energy: 365,
        },
        requiredCrew: 0,
        cargoCapacity: 0,
        fuelCapacity: 0,
        range: 0,
        civilianCapacity: 0,
    },
    {
        id: "solar",
        img: solar,
        class: "solar",
        cost: {
            credits: 975,
            minerals: 7,
            energy: 92,
        },
        requiredCrew: undefined,
        cargoCapacity: 0,
        fuelCapacity: Infinity,
        range: Infinity,
        civilianCapacity: 0,
    },
]

export default function Shipyard() {
    const planet = {
        credits: 0,
        minerals: 0,
        energy: 0,
    } satisfies Planet
    const [index, setIndex] = useState(0)
    const ship = catalog[index]
    const owned = 0

    const handlePrevious = () => {
        setIndex((index - 1 + catalog.length) % catalog.length)
    }
    const handleNext = () => {
        setIndex((index + 1) % catalog.length)
    }

    return (
        <div>
            <img src={ship.img} />
            <div>
                <div style={{ display: "flex" }}>
                    <Button onClick={handlePrevious} style={{ padding: 5 }}>
                        &lt;&lt;
                    </Button>
                    <Button style={{ padding: 5 }}>Buy</Button>
                    <div style={{ flexGrow: 1 }}></div>
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
