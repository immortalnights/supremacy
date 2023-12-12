import React from "react"
import Recoil from "recoil"
import { Grid, Stack, IconButton, Button, Typography } from "@mui/material"
import {
    ArrowDropUp,
    ArrowDropDown,
    LocalGasStation,
    Man,
    Woman,
    Add,
    Download,
    Clear,
} from "@mui/icons-material"
import { IOContext } from "../../data/IOContext"
import { SelectedPlanet, IPlanet, CapitalPlanet } from "../../data/Planets"
import { Ship } from "../../data/Ships"
import PlanetAuth from "../components/PlanetAuth"
import DockingBays from "../components/DockingBays"
import IncDecButton from "../components/IncreaseDecreaseButton"
import ShipProperties from "./ShipProperties"
import DecommissionDialog from "./ConfirmDecommissionDialog"
import type { ShipID, IShip } from "@server/simulation/types"
import { totalCargo } from "../utilities/ships"
import Inventory from "./Inventory"
import "./styles.css"

interface IShipDetailsProps {
    ship: IShip | undefined
    onModifyPassengers: (ship: IShip, amount: number) => void
    onModifyFuels: (ship: IShip, amount: number) => void
    onClickAddCrew: (ship: IShip) => void
    onClickEmptyCargo: (ship: IShip) => void
    onClickDecommission: (ship: IShip) => void
}

const ShipDetails = ({
    ship,
    onModifyPassengers,
    onModifyFuels,
    onClickAddCrew,
    onClickEmptyCargo,
    onClickDecommission,
}: IShipDetailsProps) => {
    const handleClickAddPassengers = (
        event: React.MouseEvent,
        value: number
    ) => {
        onModifyPassengers(ship as IShip, value)
    }

    const handleClickRemovePassengers = (
        event: React.MouseEvent,
        value: number
    ) => {
        onModifyPassengers(ship as IShip, value)
    }

    const handleClickAddFuels = (event: React.MouseEvent, value: number) => {
        onModifyFuels(ship as IShip, value)
    }

    const handleClickRemoveFuels = (event: React.MouseEvent, value: number) => {
        onModifyFuels(ship as IShip, value)
    }

    let canModifyPassengers = false
    let canModifyFuels = false
    let canAddCrew = false
    let canEmptyCargo = false
    let canDecommission = false

    if (ship) {
        if (ship.capacity) {
            canModifyPassengers = ship.capacity.civilians > 0
            canModifyFuels = ship.capacity.fuels > 0
            canEmptyCargo =
                ship.capacity.cargo > 0 && totalCargo(ship.cargo) > 0
        }

        canAddCrew = ship.requiredCrew > 0 && ship.crew !== ship.requiredCrew
        // FIXME only true if something is in the cargo
        canDecommission = true
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
            }}
        >
            <div
                style={{ height: 80, width: 100, backgroundColor: "lightgray" }}
            />
            <div>
                <Typography
                    component="div"
                    variant="caption"
                    sx={{ textAlign: "right" }}
                >
                    {ship?.passengers || 0}
                </Typography>
                <Stack direction="row">
                    <Stack direction="column">
                        <IncDecButton
                            mode="increase"
                            disabled={!canModifyPassengers}
                            onChange={handleClickAddPassengers}
                            grayscale
                        />
                        <IncDecButton
                            mode="decrease"
                            disabled={!canModifyPassengers}
                            onChange={handleClickRemovePassengers}
                            grayscale
                        />
                    </Stack>
                    <div>
                        <Man />
                        <Woman />
                    </div>
                </Stack>
            </div>
            <div>
                <Typography
                    component="div"
                    variant="caption"
                    sx={{ textAlign: "right" }}
                >
                    {ship?.fuels || 0}
                </Typography>
                <Stack direction="row">
                    <Stack direction="column">
                        <IncDecButton
                            mode="increase"
                            disabled={!canModifyFuels}
                            onChange={handleClickAddFuels}
                            grayscale
                        />
                        <IncDecButton
                            mode="decrease"
                            disabled={!canModifyFuels}
                            onChange={handleClickRemoveFuels}
                            grayscale
                        />
                    </Stack>
                    <div>
                        <LocalGasStation />
                    </div>
                </Stack>
            </div>
            <Stack direction="column">
                <Button
                    fullWidth={true}
                    size="small"
                    startIcon={<Add />}
                    disabled={!canAddCrew}
                    onClick={() => onClickAddCrew(ship as IShip)}
                >
                    Add Crew
                </Button>
                <Button
                    fullWidth={true}
                    size="small"
                    startIcon={<Download />}
                    disabled={!canEmptyCargo}
                    onClick={() => onClickEmptyCargo(ship as IShip)}
                >
                    Empty Cargo
                </Button>
                <Button
                    fullWidth={true}
                    size="small"
                    startIcon={<Clear />}
                    disabled={!canDecommission}
                    onClick={() => onClickDecommission(ship as IShip)}
                >
                    Decommission
                </Button>
            </Stack>
        </div>
    )
}

export const Dock = ({ planet }: { planet: IPlanet }) => {
    const [selectedShip, setSelectedShip] = React.useState<ShipID | undefined>()
    const [confirmDecommission, setConfirmDecommission] = React.useState(false)
    const ship = Recoil.useRecoilValue(Ship(selectedShip))
    const { action } = React.useContext(IOContext)

    const handleClickDockedShip = (
        event: React.MouseEvent<HTMLLIElement>,
        ship: IShip
    ) => {
        setSelectedShip(ship.id)
    }

    const handleModifyPassengers = (ship: IShip, amount: number) => {
        action("ship-modify-passengers", { id: ship.id, amount })
    }

    const handleModifyFuels = (ship: IShip, amount: number) => {
        action("ship-modify-fuels", { id: ship.id, amount })
    }

    // FIXME ship properties does not update as the selected ship is cached in this Component state
    const handleClickAddCrew = (ship: IShip) => {
        action("ship-add-crew", { id: ship.id })
    }

    const handleClickEmptyCargo = (ship: IShip) => {
        action("ship-empty-cargo", { id: ship.id })
    }

    const handleClickDecommission = (ship: IShip) => {
        setConfirmDecommission(true)
    }

    const handleConfirmDecommission = (ship: IShip) => {
        action("ship-decommission", { id: ship.id })
        setConfirmDecommission(false)
        setSelectedShip(undefined)
    }

    const handleClose = () => {
        setConfirmDecommission(false)
    }

    const handleModifyCargo = (type: string, amount: number) => {
        action("ship-modify-cargo", { id: ship?.id, type, amount })
    }

    return (
        <Grid container>
            <Grid item xs={8}>
                {ship && confirmDecommission && (
                    <DecommissionDialog
                        open
                        ship={ship as IShip}
                        onConfirm={handleConfirmDecommission}
                        onCancel={handleClose}
                        onClose={handleClose}
                    />
                )}
                <Stack direction="row" justifyContent="space-around">
                    <DockingBays
                        planet={planet}
                        selected={ship?.id}
                        onItemClick={handleClickDockedShip}
                    />
                    <ShipProperties planet={planet} ship={ship} />
                </Stack>
                <ShipDetails
                    ship={ship}
                    onModifyPassengers={handleModifyPassengers}
                    onModifyFuels={handleModifyFuels}
                    onClickAddCrew={handleClickAddCrew}
                    onClickEmptyCargo={handleClickEmptyCargo}
                    onClickDecommission={handleClickDecommission}
                />
            </Grid>
            <Grid item xs={4}>
                <Inventory
                    planet={planet}
                    ship={ship}
                    onModifyCargo={handleModifyCargo}
                />
            </Grid>
        </Grid>
    )
}

const Authed = () => {
    return <PlanetAuth view={(planet: IPlanet) => <Dock planet={planet} />} />
}

export default Authed
