import { Grid, Typography } from "@mui/material"
import { IPlanet } from "../../data/Planets"
import type { IShip } from "@server/simulation/types"
import { hasCargo, hasResource, isCargoFull } from "../utilities/ships"
import IncDecButton from "../components/IncreaseDecreaseButton"
import "./Inventory.css"

const Bars = ({ left, right }: { left: number; right: number }) => {
    const maxPlanetCapacity = (260 / 4) * 250
    const leftHeight = left > 0 ? 260 * (left / maxPlanetCapacity) : 0
    const maxShipCapacity = (260 / 4) * 25
    const rightHeight = right > 0 ? 260 * (right / maxShipCapacity) : 0

    return (
        <div
            style={{
                height: 280,
                border: "1px solid darkgreen",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
            }}
        >
            <div
                className="striped-green"
                style={{ height: leftHeight, width: "50%" }}
            />
            <div
                className="striped-red"
                style={{ height: rightHeight, width: "50%" }}
            />
        </div>
    )
}

const Inventory = ({
    planet,
    ship,
    onModifyCargo,
}: {
    planet: IPlanet
    ship: IShip | undefined
    onModifyCargo: (type: string, amount: number) => void
}) => {
    // Remove from ship / add to ship
    const canRemoveFood = !!ship && hasCargo(ship, "food")
    const canAddFood =
        !!ship && hasResource(planet, "food") && !isCargoFull(ship)
    const canRemoveMinerals = !!ship && hasCargo(ship, "minerals")
    const canAddMinerals =
        !!ship && hasResource(planet, "minerals") && !isCargoFull(ship)
    const canRemoveFuels = !!ship && hasCargo(ship, "fuels")
    const canAddFuels =
        !!ship && hasResource(planet, "fuels") && !isCargoFull(ship)
    const canRemoveEnergy = !!ship && hasCargo(ship, "energy")
    const canAddEnergy =
        !!ship && hasResource(planet, "energy") && !isCargoFull(ship)

    return (
        <Grid container>
            <Grid item xs={3} sx={{ padding: "0 1rem" }}>
                <Bars left={planet.resources.food} right={0} />
                <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                >
                    <IncDecButton
                        mode="decrease"
                        disabled={!canRemoveFood}
                        onChange={(e, value) => onModifyCargo("food", value)}
                    />
                    <IncDecButton
                        mode="increase"
                        disabled={!canAddFood}
                        onChange={(e, value) => onModifyCargo("food", value)}
                    />
                </div>
                <Typography
                    component="div"
                    variant="overline"
                    sx={{ textAlign: "center" }}
                >
                    Food
                </Typography>
                <Typography
                    component="div"
                    variant="caption"
                    sx={{ textAlign: "right" }}
                >
                    {planet.resources.food}
                </Typography>
                <Typography
                    component="div"
                    variant="caption"
                    sx={{ textAlign: "right" }}
                >
                    {ship?.cargo.food || 0}
                </Typography>
            </Grid>
            <Grid item xs={3} sx={{ padding: "0 1rem" }}>
                <Bars left={planet.resources.minerals} right={0} />
                <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                >
                    <IncDecButton
                        mode="decrease"
                        disabled={!canRemoveMinerals}
                        onChange={(event, value) =>
                            onModifyCargo("minerals", value)
                        }
                    />
                    <IncDecButton
                        mode="increase"
                        disabled={!canAddMinerals}
                        onChange={(event, value) =>
                            onModifyCargo("minerals", value)
                        }
                    />
                </div>
                <Typography
                    component="div"
                    variant="overline"
                    sx={{ textAlign: "center" }}
                >
                    Minerals
                </Typography>
                <Typography
                    component="div"
                    variant="caption"
                    sx={{ textAlign: "right" }}
                >
                    {planet.resources.minerals}
                </Typography>
                <Typography
                    component="div"
                    variant="caption"
                    sx={{ textAlign: "right" }}
                >
                    {ship?.cargo.minerals || 0}
                </Typography>
            </Grid>
            <Grid item xs={3} sx={{ padding: "0 1rem" }}>
                <Bars left={planet.resources.fuels} right={0} />
                <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                >
                    <IncDecButton
                        mode="decrease"
                        disabled={!canRemoveFuels}
                        onChange={(event, value) =>
                            onModifyCargo("fuels", value)
                        }
                    />
                    <IncDecButton
                        mode="increase"
                        disabled={!canAddFuels}
                        onChange={(event, value) =>
                            onModifyCargo("fuels", value)
                        }
                    />
                </div>
                <Typography
                    component="div"
                    variant="overline"
                    sx={{ textAlign: "center" }}
                >
                    Fuels
                </Typography>
                <Typography
                    component="div"
                    variant="caption"
                    sx={{ textAlign: "right" }}
                >
                    {planet.resources.fuels}
                </Typography>
                <Typography
                    component="div"
                    variant="caption"
                    sx={{ textAlign: "right" }}
                >
                    {ship?.cargo.fuels || 0}
                </Typography>
            </Grid>
            <Grid item xs={3} sx={{ padding: "0 1rem" }}>
                <Bars left={planet.resources.energy} right={0} />
                <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                >
                    <IncDecButton
                        mode="decrease"
                        disabled={!canRemoveEnergy}
                        onChange={(event, value) =>
                            onModifyCargo("energy", value)
                        }
                    />
                    <IncDecButton
                        mode="increase"
                        disabled={!canAddEnergy}
                        onChange={(event, value) =>
                            onModifyCargo("energy", value)
                        }
                    />
                </div>
                <Typography
                    component="div"
                    variant="overline"
                    sx={{ textAlign: "center" }}
                >
                    Energy
                </Typography>
                <Typography
                    component="div"
                    variant="caption"
                    sx={{ textAlign: "right" }}
                >
                    {planet.resources.energy}
                </Typography>
                <Typography
                    component="div"
                    variant="caption"
                    sx={{ textAlign: "right" }}
                >
                    {ship?.cargo.energy || 0}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default Inventory
