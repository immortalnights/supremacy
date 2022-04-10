import React from "react"
import Recoil from "recoil"
import { StarDate } from "../components/StarDate"

const ShipDetails = () => {
  const ship = {
    name: "",
    type: "",
    crew: "",
    fuel: "",
  }

  return (
    <dl>
      <dt>Ship</dt>
      <dd>{ship ? ship.name : ''}</dd>
      <dt>Date</dt>
      <dd><StarDate /></dd>
      <dt>Class</dt>
      <dd>{ship ? ship.type : ''}</dd>
      <dt>Crew</dt>
      <dd>{ship ? ship.crew : ''}</dd>
      <dt>Fuel</dt>
      <dd>{ship ? ship.fuel : ''}</dd>
    </dl>
  )
}

export default ShipDetails