import React from "react"
import Recoil from "recoil"
import { Button, Grid, Typography } from "@mui/material"
import { IOContext } from "../../data/IOContext"
import { SelectedPlanetID } from "../../data/General"
import { IPlanet, IPlanetBasic } from "../../data/Planets"
import { Ship } from "../../data/Ships"
import DockingBays from "../components/DockingBays"
import FleetGrid from "../components/grid/FleetGrid"
import PlanetAuth from "../components/PlanetAuth"
import ShipDetails from "./ShipDetails"
import ShipHeading from "./ShipHeading"
import { RenameDialog } from "../components/NameDialog"
import PlanetGrid from "../components/grid/PlanetGrid"
import { IShip, ShipID } from "@server/simulation/types"

type FleetMode = "normal" | "ship-destination"

const Fleet = ({ planet }: { planet: IPlanet }) => {
    const [selectedShip, setSelectedShip] = React.useState<ShipID | undefined>()
    const [selectedPlanet, setSelectedPlanet] =
        Recoil.useRecoilState(SelectedPlanetID)
    const [renameShip, setRenameShip] = React.useState(false)
    const [mode, setMode] = React.useState<FleetMode>("normal")
    const ship = Recoil.useRecoilValue(Ship(selectedShip))
    const { action } = React.useContext(IOContext)

    const handleClickDockedShip = (
        event: React.MouseEvent<HTMLLIElement>,
        dockedShip: IShip
    ) => {
        setSelectedShip(dockedShip.id)
        setMode("normal")
    }

    const handleSelectShip = (selectedShip: IShip) => {
        setSelectedShip(selectedShip.id)
        if (selectedShip.location.planet !== undefined) {
            setSelectedPlanet(selectedShip.location.planet)
        } else if (selectedShip.heading !== undefined) {
            setSelectedPlanet(selectedShip.heading.to)
        }
    }

    const handleAbortTravelClick = () => {
        action("ship-abort-travel", { id: ship!.id })
        setMode("normal")
    }

    const handleRenameClick = () => {
        setRenameShip(true)
        setMode("normal")
    }

    const handleCancelRenameShip = () => {
        setRenameShip(false)
    }

    const handleRenameShip = (name: string) => {
        action("ship-rename", { id: ship!.id, name })
        setRenameShip(false)
    }

    const handleLaunchClick = () => {
        console.assert(ship, "")
        action("ship-relocate", { id: ship!.id, position: "orbit" })
        setMode("normal")
    }

    const handleTravelToClick = () => {
        setMode("ship-destination")
    }

    const handleLandClick = () => {
        console.assert(ship, "")
        action("ship-relocate", { id: ship!.id, position: "docking-bay" })
        setMode("normal")
    }

    const handleSelectPlanet = (planet: IPlanetBasic) => {
        action("ship-travel", { id: ship!.id, location: planet.id })
        setMode("normal")
    }

    const handleCancelTravel = () => {
        setMode("normal")
    }

    React.useEffect(() => {
        if (
            ship &&
            ship.location.planet !== undefined &&
            ship.location.planet !== selectedPlanet
        ) {
            setSelectedPlanet(ship.location.planet)
        }
    }, [ship, selectedPlanet])

    let canLaunch = false
    let canTravel = false
    let canLand = false
    let canAbortTravel = false
    let canRename = false

    if (ship) {
        if (ship.type !== "Atmosphere Processor") {
            const hasCrew =
                ship.requiredCrew === 0 || ship.crew === ship.requiredCrew
            const hasFuel = ship.capacity.fuels === 0 || ship.fuels > 0
            canLaunch =
                ship.location.position === "docking-bay" && hasCrew && hasFuel
            canTravel = ship.location.position === "orbit" && hasCrew && hasFuel
            canLand = ship.location.position === "orbit"
            canAbortTravel = ship.location.position === "deep-space"
        }
        canRename = true
    }

    return (
        <>
            {ship && renameShip && (
                <RenameDialog
                    open
                    name={ship.name}
                    onConfirm={handleRenameShip}
                    onCancel={handleCancelRenameShip}
                />
            )}
            <Grid container>
                <Grid item xs={2} md={2}>
                    <DockingBays
                        planet={planet}
                        selected={ship?.id}
                        onItemClick={handleClickDockedShip}
                    />
                </Grid>
                <Grid item xs={0} md={1} />
                <Grid item xs={8} md={6}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                        }}
                    >
                        <Button
                            disabled={!canLaunch}
                            onClick={handleLaunchClick}
                        >
                            Launch
                        </Button>
                        <Button
                            disabled={!canTravel}
                            onClick={handleTravelToClick}
                        >
                            Travel To
                        </Button>
                        <Button disabled={!canLand} onClick={handleLandClick}>
                            Land
                        </Button>
                    </div>
                    <ShipDetails ship={ship} />
                </Grid>
                <Grid item xs={0} md={1} />
                <Grid item xs={2} md={2}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            disabled={!canAbortTravel}
                            onClick={handleAbortTravelClick}
                        >
                            Abort Travel
                        </Button>
                        <Button
                            disabled={!canRename}
                            onClick={handleRenameClick}
                        >
                            Rename
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={0} md={1} />
                <Grid item xs={8} md={5}>
                    {ship && mode === "ship-destination" ? (
                        <>
                            <PlanetGrid onSelectItem={handleSelectPlanet} />
                            <Typography textAlign="center">
                                Select destination planet or{" "}
                                <Button
                                    variant="text"
                                    onClick={handleCancelTravel}
                                >
                                    Cancel
                                </Button>
                            </Typography>
                        </>
                    ) : (
                        <FleetGrid
                            selectedItem={ship}
                            onSelectItem={handleSelectShip}
                        />
                    )}
                </Grid>
                <Grid item xs={0} md={1} />
                <Grid item xs={4} md={4}>
                    <ShipHeading ship={ship} />
                </Grid>
                <Grid item xs={0} md={1} />
            </Grid>
        </>
    )
}

const Authed = () => {
    // Can see the ships in/around any planet
    const doCheck = () => true

    // FIXME PlanetAuth used for planet loading state
    return (
        <PlanetAuth
            view={(planet: IPlanet) => <Fleet planet={planet} />}
            check={doCheck}
        />
    )
}

export default Authed
