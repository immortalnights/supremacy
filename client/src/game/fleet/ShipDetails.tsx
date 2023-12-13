import { Grid } from "@mui/material"
import StarDate from "../components/StarDate"
import { IShip } from "@server/simulation/types"

const Details = ({ ship }: { ship: IShip }) => {
    return (
        <>
            <Grid item xs={12} md={6}>
                Ship
            </Grid>
            <Grid item xs={12} md={6}>
                {ship.name}
            </Grid>
            <Grid item xs={12} md={6}>
                Class
            </Grid>
            <Grid item xs={12} md={6}>
                {ship.type}
            </Grid>
            <Grid item xs={12} md={6}>
                Crew
            </Grid>
            <Grid item xs={12} md={6}>
                {ship.requiredCrew > 0 ? ship.crew : "-"}
            </Grid>
            <Grid item xs={12} md={6}>
                Fuel
            </Grid>
            <Grid item xs={12} md={6}>
                {ship.requiresFuel ? ship.fuels : "Nuclear"}
            </Grid>
        </>
    )
}

const ShipDetails = ({ ship }: { ship: IShip | undefined }) => {
    return (
        <Grid container>
            <Grid item xs={12} md={6}>
                Date
            </Grid>
            <Grid item xs={12} md={6}>
                <StarDate />
            </Grid>
            {ship ? <Details ship={ship} /> : null}
        </Grid>
    )
}

export default ShipDetails
