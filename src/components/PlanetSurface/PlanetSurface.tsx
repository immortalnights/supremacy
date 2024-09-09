import { ColonizedPlanet, Ship } from "../../Game/entities"
import { shipInLocation } from "../../Game/utilities"
import Button from "../Button"
import ShipIcon from "../ShipIcon"
import { useShipsOnPlanetSurface } from "../../Game/dataHooks"

function Location({
    ship,
    onClick,
    onEnable,
    onDisable,
}: {
    ship?: Ship
    onClick: (ship: Ship) => void
    onEnable: (ship: Ship) => void
    onDisable: (ship: Ship) => void
}) {
    const handleClick = () => {
        if (ship) {
            onClick(ship)
        }
    }

    const handleEnable = () => {
        if (ship) {
            onEnable(ship)
        }
    }

    const handleDisable = () => {
        if (ship) {
            onDisable(ship)
        }
    }

    return (
        <div style={{ userSelect: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button onClick={handleEnable} style={{ textAlign: "right" }}>
                    On
                </Button>
                {` · `}
                <Button onClick={handleDisable}>Off</Button>
            </div>
            <Button onClick={handleClick} style={{}}>
                <ShipIcon ship={ship} />
                <div
                    style={{
                        marginTop: 5,
                        borderWidth: "2px 1px 2px 1px",
                        borderStyle: "solid",
                        borderColor: "#bd414b",
                        height: "1em",
                        padding: 1,
                        textTransform: "uppercase",
                    }}
                >
                    {ship?.name}
                </div>
                <div
                    style={{
                        borderWidth: "0 1px 2px 1px",
                        borderStyle: "solid",
                        borderColor: "#bd414b",
                        height: "1em",
                        padding: 1,
                        textTransform: "uppercase",
                    }}
                >
                    {ship?.active && "Running"}
                </div>
            </Button>
        </div>
    )
}

export default function PlanetSurface({
    planet,
    onClick,
    onEnable,
    onDisable,
}: {
    planet: ColonizedPlanet
    onClick: (ship: Ship) => void
    onEnable: (ship: Ship) => void
    onDisable: (ship: Ship) => void
}) {
    const ships = useShipsOnPlanetSurface(planet)

    return (
        <div style={{ display: "flex" }}>
            {Array(6)
                .fill(undefined)
                .map((_, index) => {
                    const ship = shipInLocation(ships, index)
                    return (
                        <Location
                            key={`S${index}${ship?.name}`}
                            ship={ship}
                            onClick={onClick}
                            onEnable={onEnable}
                            onDisable={onDisable}
                        />
                    )
                })}
        </div>
    )
}
