import { Planet } from "../../Game/entities"
import Button from "../Button"
import Date from "../Date"
import taxUpIcon from "/images/tax_up.png"
import taxDownIcon from "/images/tax_down.png"
import Metadata, { MetadataLabel, MetadataValue } from "../Metadata"

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
                    <Button
                        onClick={onDecrease}
                        style={{ border: "2px solid gold" }}
                    >
                        <img src={taxDownIcon} />
                    </Button>
                </div>
                <MetadataLabel label={label} />
            </div>
        </div>
    )
}

export default function PlanetDetails({ planet }: { planet: Planet }) {
    let populationGrowth
    if (planet.population) {
        let growthModifier
        if (planet.growth > 0) {
            growthModifier = "+"
        } else if (planet.growth < 0) {
            growthModifier = "-"
        } else {
            growthModifier = ""
        }
        populationGrowth = `${growthModifier}${planet.growth}`
    }

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
                            planet.owner === "local"
                                ? "Your Star"
                                : "Enemy Star"
                        }
                    />
                    <Metadata label="Credits" value={planet.credits} />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        marginTop: 8,
                    }}
                >
                    <Metadata label="Food" value={planet.food} postfix=".T" />
                    <Metadata
                        label="Minerals"
                        value={planet.minerals}
                        postfix=".T"
                    />
                    <Metadata label="Fuels" value={planet.fuels} postfix=".T" />
                    <Metadata
                        label="Energy"
                        value={planet.energy}
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
                <Metadata label="Population" value={planet.population} />
                <Metadata
                    label="Pop. Growth"
                    value={populationGrowth}
                    postfix="%"
                />
                <Metadata label="Moral" value={planet.moral} postfix="%" />

                <TaxRate
                    value={planet.tax}
                    onIncrease={() => {}}
                    onDecrease={() => {}}
                />

                <Metadata
                    label="Military Strength"
                    value={planet.strength}
                    style={{ marginTop: 20 }}
                />
            </div>
        </div>
    )
}
