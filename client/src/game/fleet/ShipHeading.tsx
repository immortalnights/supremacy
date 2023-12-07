import { Typography } from "@mui/material"
import React from "react"
import Recoil from "recoil"
import { Planet } from "../../data/Planets"
import { IShip, IShipHeading } from "../../simulation/types.d"
import { StarDate } from "../components/StarDate"
// import { DateDisplay } from "../../components/date"

const CurrentLocation = ({ ship }: { ship: IShip }) => {
    const planet = Recoil.useRecoilValue(Planet(ship.location.planet))

    return (
        <>
            <Typography variant="subtitle1">Location</Typography>
            <dl>
                <dt>Ship</dt>
                <dd>{ship.name}</dd>
                <dt>Location</dt>
                <dt>{planet ? planet.name : "-"}</dt>
                <dt>Position</dt>
                {/* // FIXME format string */}
                <dt>{ship.location.position}</dt>
            </dl>
        </>
    )
}

const Heading = ({ ship }: { ship: IShip }) => {
    const heading = ship!.heading as IShipHeading
    const source = Recoil.useRecoilValue(Planet(heading.from))
    const destination = Recoil.useRecoilValue(Planet(heading.to))

    return (
        <>
            <label>Heading</label>
            <dl>
                <dt>Ship</dt>
                <dd>{ship.name}</dd>
                <dt>From</dt>
                <dd>{source!.name}</dd>
                <dt>To</dt>
                <dd>{destination!.name}</dd>
                <dt>Departed</dt>
                <dd>
                    <StarDate date={heading.departed} />
                </dd>
                <dt>EDA</dt>
                <dd>
                    <StarDate date={heading.arrival} />
                </dd>
                <dt>Fuel</dt>
                <dd>{heading.fuels || "-"}</dd>
            </dl>
        </>
    )
}

const ShipHeading = ({ ship }: { ship: IShip | undefined }) => {
    let content

    if (!ship) {
        content = <div>No selected ship</div>
    } else if (!ship.heading) {
        content = <CurrentLocation ship={ship} />
    } else {
        const heading = ship.heading
        content = <Heading ship={ship} />
    }

    return <div>{content}</div>
}

export default ShipHeading
