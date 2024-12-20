import { ColonizedPlanet } from "Game/entities"
import Button from "components/Button"
import Date from "Game/components/Date"
import taxUpIcon from "/images/tax_up.png"
import taxDownIcon from "/images/tax_down.png"
import Metadata, { MetadataLabel, MetadataValue } from "Game/components/Metadata"
import { sessionAtom } from "Game/store"
import { useAtomValue } from "jotai"
import { useAdjustTax } from "../../actions"
import { useSelectedColonizedPlanet } from "Game/hooks"
import { throwError } from "game-signaling-server/client"

function TaxRate({
    value,
    onIncrease,
    onDecrease,
}: {
    value: string | number
    onIncrease: () => void
    onDecrease: () => void
}) {
    const label = "Tax Rate"

    return (
        <div
            style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
            }}
        >
            <MetadataValue label={label} value={value} postfix="%" />
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "min-content",
                    }}
                >
                    <Button
                        onClick={onIncrease}
                        style={{
                            border: "2px solid gold",
                            borderRight: "none",
                        }}
                    >
                        <img src={taxUpIcon} />
                    </Button>
                    <Button onClick={onDecrease} style={{ border: "2px solid gold" }}>
                        <img src={taxDownIcon} />
                    </Button>
                </div>
                <MetadataLabel label={label} />
            </div>
        </div>
    )
}

export default function PlanetDetails() {
    const { localPlayer } = useAtomValue(sessionAtom)
    const planet = useSelectedColonizedPlanet() ?? throwError("Invalid selected planet")
    const adjustTax = useAdjustTax()

    let populationGrowth = ""
    if (planet.population) {
        let growthModifier
        if (planet.growth > 0) {
            growthModifier = "+"
        } else if (planet.growth < 0) {
            growthModifier = "-"
        } else {
            growthModifier = ""
        }
        populationGrowth = `${growthModifier} ${Math.abs(planet.growth).toFixed(2)}`
    }

    const planetStrength = 0

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                width: 400,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <Metadata label="Planet" value={planet.name} />
                    <Date />
                    <Metadata
                        label="Status"
                        value={
                            planet.owner === localPlayer ? "Your Star" : "Enemy Star"
                        }
                    />
                    <Metadata
                        label="Credits"
                        value={planet.credits}
                        format={Math.floor}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        marginTop: 8,
                    }}
                >
                    <Metadata
                        label="Food"
                        value={planet.food}
                        format={Math.floor}
                        postfix=".T"
                    />
                    <Metadata
                        label="Minerals"
                        value={planet.minerals}
                        format={Math.floor}
                        postfix=".T"
                    />
                    <Metadata
                        label="Fuels"
                        value={planet.fuels}
                        format={Math.floor}
                        postfix=".T"
                    />
                    <Metadata
                        label="Energy"
                        value={planet.energy}
                        format={Math.floor}
                        postfix=".T"
                    />
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                <Metadata
                    label="Population"
                    value={planet.population}
                    format={Math.floor}
                />
                <Metadata label="Pop. Growth" value={populationGrowth} postfix="%" />
                <Metadata label="Moral" value={planet.morale.toFixed(2)} postfix="%" />

                <TaxRate
                    value={Math.floor(planet.tax)}
                    onIncrease={() => adjustTax(planet, +1)}
                    onDecrease={() => adjustTax(planet, -1)}
                />

                <Metadata
                    label="Military Strength"
                    value={planetStrength}
                    format={Math.floor}
                    style={{ marginTop: 20 }}
                />
            </div>
        </div>
    )
}
