import React from "react"
import Recoil from "recoil"
// import { DateDisplay } from "../../components/date"

const DateDisplay = ({ date }: { date: any }) => {
  return (<div>?</div>)
}

const ShipHeading = ({}) => {
  let ship: any
  let content

  if (ship && ship.heading)
  {
    const heading = ship.heading
    content = (
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
        <dd>{heading.fuel}</dd>
      </dl>
    )
  }

  return (
    <div>
      <label>Heading</label>
      {content ? content : (<div>No selected ship</div>)}
    </div>
  )
}

export default ShipHeading