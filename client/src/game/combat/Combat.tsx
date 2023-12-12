import React from "react"
import Recoil from "recoil"
import {
    Grid,
    GridDirection,
    IconButton,
    Stack,
    Typography,
} from "@mui/material"
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material"
import { IPlayer, Player } from "../../data/Player"
import { SelectedPlanet } from "../../data/Planets"
import {
    PlatoonsOnPlanet,
    PlatoonsOnShip,
    IPlatoonBasic,
    IPlatoon,
    PlanetStrength,
    PlanetEnemyStrength,
} from "../../data/Platoons"
import { Ship, PlayerShipsAtPlanetPosition } from "../../data/Ships"
import { IOContext } from "../../data/IOContext"
import DockingBays from "../components/DockingBays"
import PlanetAuth from "../components/PlanetAuth"
import type { IPlanet, IShip, ShipID } from "@server/simulation/types"

const PlatoonGridItem = ({
    name,
    troops,
    onClick,
}: {
    name?: string
    troops?: number
    onClick: (event: React.MouseEvent) => void
}) => {
    return (
        <Grid
            item
            sx={{
                margin: "1px 4px",
                display: "flex",
                flexDirection: "row",
                flexBasis: "30%",
            }}
            onClick={onClick}
        >
            <div
                style={{
                    border: "1px solid #6b6bf3",
                    minWidth: "3em",
                    minHeight: "1.7rem",
                    margin: "1px",
                    textAlign: "center",
                }}
            >
                {troops}
            </div>
            <div
                style={{
                    border: "1px solid #6b6bf3",
                    minWidth: "2.5em",
                    minHeight: "1.7rem",
                    margin: "1px",
                    textAlign: "center",
                }}
            >
                {name}
            </div>
        </Grid>
    )
}

interface PlatoonGridProps {
    items: IPlatoonBasic[]
    count: number
    direction: GridDirection
    onSelectItem: (event: React.MouseEvent, item: IPlatoonBasic) => void
}

const PlatoonGrid = ({
    items,
    count,
    direction,
    onSelectItem,
}: PlatoonGridProps) => {
    const cells: React.ReactElement[] = []

    for (let index = 0; index < count; index++) {
        cells.push(
            <PlatoonGridItem
                key={index}
                {...items[index]}
                onClick={(event: React.MouseEvent) =>
                    items[index] && onSelectItem(event, items[index])
                }
            />
        )
    }

    return (
        <Grid container direction={direction}>
            {cells}
        </Grid>
    )
}

const ShipDetails = ({
    ship,
    onClickUnloadPlatoon,
}: {
    ship: IShip | undefined
    onClickUnloadPlatoon: (event: React.MouseEvent, item: IPlatoonBasic) => void
}) => {
    const platoons = Recoil.useRecoilValue(PlatoonsOnShip({ ship: ship?.id }))

    return (
        <div>
            <Typography variant="caption">Ship</Typography>
            <Typography variant="caption">{ship?.name}</Typography>
            <PlatoonGrid
                items={platoons}
                count={4}
                direction="column"
                onSelectItem={onClickUnloadPlatoon}
            />
        </div>
    )
}

interface IAggressionProps {
    aggression: number
    onClickIncrease: (event: React.MouseEvent) => void
    onClickDecrease: (event: React.MouseEvent) => void
}

const Aggression = ({
    aggression,
    onClickIncrease,
    onClickDecrease,
}: IAggressionProps) => {
    const canIncrease = aggression < 100
    const canDecrease = aggression > 25

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                style={{ border: "1px dashed lightgray", borderRadius: 4 }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <IconButton
                        size="small"
                        disabled={!canIncrease}
                        onClick={onClickIncrease}
                    >
                        <ArrowDropUp />
                    </IconButton>
                    <IconButton
                        size="small"
                        disabled={!canDecrease}
                        onClick={onClickDecrease}
                    >
                        <ArrowDropDown />
                    </IconButton>
                </div>
                <div
                    style={{
                        width: 160,
                        height: 120,
                        backgroundColor: "lightgray",
                        marginRight: 34,
                    }}
                ></div>
            </Stack>
            <Typography component="p" variant="caption" textAlign="center">
                Aggression {aggression === 100 ? "MAX" : `${aggression}%`}
            </Typography>
        </>
    )
}

const Combat = ({
    planet,
    owner: _owner,
}: {
    planet: IPlanet
    owner: boolean
}) => {
    const [selectedShip, setSelectedShip] = React.useState<ShipID | undefined>()
    const platoons = Recoil.useRecoilValue(
        PlatoonsOnPlanet({ planet: planet.id })
    )
    const strength = Recoil.useRecoilValue(
        PlanetStrength({ planet: planet.id })
    )
    const enemyStrength = Recoil.useRecoilValue(
        PlanetEnemyStrength({ planet: planet.id })
    )
    const ship = Recoil.useRecoilValue(Ship(selectedShip))
    const remainingTroops = platoons.reduce(
        (val, p) => val + (p as IPlatoon).troops,
        0
    )
    const { action } = React.useContext(IOContext)

    const handleClickDockedShip = (
        _event: React.MouseEvent<HTMLLIElement>,
        ship: IShip
    ) => {
        setSelectedShip(ship.id)
    }

    const handleClickUnloadPlatoon = async (
        _event: React.MouseEvent,
        item: IPlatoonBasic
    ) => {
        if (ship) {
            await action("platoon-relocate", {
                id: item.id,
                direction: "unload",
                ship: ship.id,
            })
        }
    }

    const handleClickLoadPlatoon = async (
        _event: React.MouseEvent,
        item: IPlatoonBasic
    ) => {
        if (ship) {
            await action("platoon-relocate", {
                id: item.id,
                direction: "load",
                ship: ship.id,
            })
        }
    }

    const handleClickIncreaseAggression = async (_event: React.MouseEvent) => {
        await action("planet-modify-aggression", {
            id: planet.id,
            direction: 1,
        })
    }

    const handleClickDecreaseAggression = async (_event: React.MouseEvent) => {
        await action("planet-modify-aggression", {
            id: planet.id,
            direction: -1,
        })
    }

    return (
        <Grid container>
            <Grid item xs={5}>
                <Stack direction="row">
                    <DockingBays
                        planet={planet}
                        selected={ship?.id}
                        onItemClick={handleClickDockedShip}
                    />
                    <ShipDetails
                        ship={ship}
                        onClickUnloadPlatoon={handleClickUnloadPlatoon}
                    />
                </Stack>
                <PlatoonGrid
                    items={platoons}
                    count={24}
                    direction="row"
                    onSelectItem={handleClickLoadPlatoon}
                />
            </Grid>
            <Grid item xs={2}>
                <div style={{ display: "flex", flexGrow: "1", height: "100%" }}>
                    <div
                        style={{
                            height: "100%",
                            backgroundColor: "black",
                            width: 20,
                            margin: "0 0.15rem",
                        }}
                    ></div>
                    <div
                        style={{
                            height: "100%",
                            backgroundColor: "black",
                            width: 20,
                            margin: "0 0.15rem",
                        }}
                    ></div>
                </div>
            </Grid>
            <Grid item xs={5}>
                <div>
                    <div
                        style={{
                            width: 160,
                            height: 140,
                            backgroundColor: "lightgray",
                            margin: "0 34px",
                        }}
                    ></div>
                    <Typography
                        component="p"
                        variant="caption"
                        sx={{ display: "flex", margin: "0 1rem" }}
                    >
                        <span>Your total strength</span>
                        <span style={{ flexGrow: 1 }}></span>
                        <span>{strength}</span>
                    </Typography>
                    <Typography
                        component="p"
                        variant="caption"
                        sx={{ display: "flex", margin: "0 1rem" }}
                    >
                        <span>Total troops left</span>
                        <span style={{ flexGrow: 1 }}></span>
                        <span>{remainingTroops}</span>
                    </Typography>
                    <Typography
                        component="p"
                        variant="caption"
                        sx={{ display: "flex", margin: "0 1rem" }}
                    >
                        <span>Enemy total strength</span>
                        <span style={{ flexGrow: 1 }}></span>
                        <span>{enemyStrength}</span>
                    </Typography>
                    {/* <Typography variant="caption">Scaling factor {scalingFactor}</Typography> */}

                    <Aggression
                        aggression={planet.aggression}
                        onClickIncrease={handleClickIncreaseAggression}
                        onClickDecrease={handleClickDecreaseAggression}
                    />
                </div>
            </Grid>
        </Grid>
    )
}

const Authed = () => {
    const player = Recoil.useRecoilValue(Player) as IPlayer
    const planet = Recoil.useRecoilValue(SelectedPlanet)
    const ships = Recoil.useRecoilValue(
        PlayerShipsAtPlanetPosition({
            planet: planet?.id,
            position: "docking-bay",
        })
    )

    const doCheck = () =>
        (planet && planet.owner === player.id) || ships.length > 0

    return (
        <PlanetAuth
            view={(planet: IPlanet) => (
                <Combat planet={planet} owner={planet.owner === player.id} />
            )}
            check={doCheck}
        />
    )
}

export default Authed
