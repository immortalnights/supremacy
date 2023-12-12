import React from "react"
import Recoil from "recoil"
import { Stack, Button, Typography } from "@mui/material"
import { IOContext } from "../../data/IOContext"
import { CapitalPlanet } from "../../data/Planets"
import {
    SolarSystem as SolarSystemData,
    ISolarSystem,
} from "../../data/SolarSystem"
import { Difficulty } from "../../simulation/types"
import {
    StaticShips,
    IShipList,
    IStaticShipDetails,
} from "../../data/StaticData"
import { NewShipNameDialog } from "../components/NameDialog"
import { PlayerShips } from "../../data/Ships"

const ItemDetails = ({
    label,
    value,
    units = "",
}: {
    label: string
    units?: string
    value: string | number
}) => {
    return (
        <Typography variant="caption" display="block">
            {value} {units} : {label}
        </Typography>
    )
}

const Shipyard = () => {
    const ShipData = Recoil.useRecoilValue(StaticShips) as IShipList
    const planet = Recoil.useRecoilValue(CapitalPlanet)
    const playerShips = Recoil.useRecoilValue(PlayerShips)
    const { difficulty } = Recoil.useRecoilValue(
        SolarSystemData
    ) as ISolarSystem
    const { action } = React.useContext(IOContext)
    const [selected, setSelected] = React.useState(0)
    const [purchasing, setPurchasing] = React.useState(false)
    const selectedShip =
        ShipData[Object.keys(ShipData)[selected] as keyof typeof ShipData]

    const handleNextClick = () => {
        const max = Object.keys(ShipData).length - 1
        const next = selected + 1
        setSelected(next < max ? next : 0)
    }

    const handlePrevClick = () => {
        const max = Object.keys(ShipData).length - 1
        const prev = selected - 1
        setSelected(prev >= 0 ? prev : max)
    }

    const handleBuyClick = () => {
        setPurchasing(true)
    }

    const handleCompletePurchase = (name: string) => {
        setPurchasing(false)
        action("ship-purchase", {
            id: Object.keys(ShipData)[selected],
            name,
        })
    }
    const handleCancelPurchase = () => setPurchasing(false)

    let defaultName = ""
    if (purchasing) {
        const owned = playerShips.filter((s) => s.type === selectedShip.type)
        defaultName = `${selectedShip.shortName}${owned.length + 1}`
    }

    return (
        <div>
            {purchasing && (
                <NewShipNameDialog
                    open
                    name={defaultName}
                    type={selectedShip.type}
                    onConfirm={handleCompletePurchase}
                    onCancel={handleCancelPurchase}
                />
            )}
            <div
                style={{ backgroundColor: "gray", height: 200, margin: "1em" }}
            >
                {selectedShip.shortName}
            </div>
            <Stack direction="row">
                <Button onClick={handlePrevClick}>&lt;&lt;</Button>
                <Button onClick={handleBuyClick}>Buy</Button>
                <div style={{ flexGrow: 1 }}>
                    <Typography variant="caption" display="block">
                        &gt; {selectedShip.description}
                    </Typography>
                    <Typography variant="caption" display="block">
                        &gt; Type: {selectedShip.type}
                    </Typography>
                </div>
                <Button onClick={handleNextClick}>&gt;&gt;</Button>
            </Stack>
            <Stack
                direction="row"
                spacing={{ xs: 2 }}
                justifyContent="space-evenly"
            >
                <div style={{ width: 120 }}>
                    <Typography>{planet.name}</Typography>
                    <ItemDetails
                        label="Credits"
                        value={Math.floor(planet.resources.credits) || 0}
                    />
                    {difficulty > Difficulty.Easy ? (
                        <ItemDetails
                            label="Minerals"
                            units="T."
                            value={Math.floor(planet.resources.minerals) || 0}
                        />
                    ) : null}
                    {difficulty > Difficulty.Medium ? (
                        <ItemDetails
                            label="Energy"
                            units="MW."
                            value={Math.floor(planet.resources.energy) || 0}
                        />
                    ) : null}
                </div>
                <div style={{ width: 120 }}>
                    <Typography>Cost</Typography>
                    <ItemDetails
                        label="Credits"
                        value={selectedShip.cost.credits}
                    />
                    {difficulty > Difficulty.Easy ? (
                        <ItemDetails
                            label="Minerals"
                            units="T."
                            value={selectedShip.cost.minerals}
                        />
                    ) : null}
                    {difficulty > Difficulty.Medium ? (
                        <ItemDetails
                            label="Energy"
                            units="MW."
                            value={selectedShip.cost.energy}
                        />
                    ) : null}
                </div>
                <div style={{ width: 120 }}>
                    <Typography>Capacity</Typography>
                    <ItemDetails
                        label="Crew"
                        value={selectedShip.requiredCrew}
                    />
                    {selectedShip.capacity && (
                        <ItemDetails
                            label="Payload"
                            units="T."
                            value={selectedShip.capacity.cargo}
                        />
                    )}
                    {selectedShip.capacity && selectedShip.capacity.fuels ? (
                        <ItemDetails
                            label="Fuel"
                            units="T."
                            value={selectedShip.capacity.fuels}
                        />
                    ) : (
                        <ItemDetails label="Fuel" value="Nuclear" />
                    )}
                </div>
                <div style={{ width: 120 }}>
                    <Typography>Data</Typography>
                    <ItemDetails label="Owned" value={0} />
                    {selectedShip.range > 0 ? (
                        <ItemDetails
                            label="Range"
                            units="KM."
                            value={selectedShip.range}
                        />
                    ) : (
                        <ItemDetails label="Range" value="Infinite" />
                    )}
                    {selectedShip.capacity ? (
                        <ItemDetails
                            label="Seats"
                            value={selectedShip.capacity.civilians}
                        />
                    ) : null}
                </div>
            </Stack>
        </div>
    )
}

export default Shipyard
