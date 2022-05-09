import React from "react"
import Recoil from "recoil"
import { Planet } from "../../data/Planets"
import { IShip } from "../../simulation/types.d"
// import { DateDisplay } from "../../components/date"

const DateDisplay = ({ date }: { date: any }) => {
  return (<div>?</div>)
}

const ShipHeading = ({ ship }: { ship: IShip | undefined }) => {
  let planet = Recoil.useRecoilValue(Planet(ship ? ship.location.planet : undefined))
  let content

  if (!ship)
  {
    content = (<div>No selected ship</div>)
  }
  else if (!ship.heading)
  {
    content = (
      <>
        <label>Location</label>
        <dl>
          <dt>Ship</dt>
          <dd>{ship.name}</dd>
          <dt>Location</dt>
          {/* // FIXME need planet name */}
          <dt>{planet ? planet.name : "-"}</dt>
          <dt>Position</dt>
          {/* // FIXME format string */}
          <dt>{ship.location.position}</dt>
        </dl>
      </>
    )
  }
  else
  {
    const heading = ship.heading
    content = (
      <>
        <label>Heading</label>
        <dl>
          <dt>Ship</dt>
          <dd>{ship.name}</dd>
          <dt>From</dt>
          <dd>{heading.from.name}</dd>
          <dt>To</dt>
          <dd>{heading.to.name}</dd>
          <dt>EDA</dt>
          <dd><DateDisplay date={heading.arrival} /></dd>
          <dt>Fuel</dt>
          <dd>{heading.fuels}</dd>
        </dl>
      </>
    )
  }

  return (
    <div>
      {content}
    </div>
  )
}

export default ShipHeading