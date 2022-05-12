import React from "react"
import Recoil from "recoil"
import StarDate from "../components/StarDate"
import { IShip } from "../../simulation/types.d"


const Details = ({ ship }: { ship: IShip }) => {
  return (
    <>
      <dt>Ship</dt>
      <dd>{ship.name}</dd>
      <dt>Class</dt>
      <dd>{ship.type}</dd>
      <dt>Crew</dt>
      <dd>{ship.requiredCrew > 0 ? ship.crew : "-"}</dd>
      <dt>Fuel</dt>
      <dd>{ship.requiresFuel ? ship.cargo?.fuels : "Nuclear"}</dd>
    </>
  )
}

const ShipDetails = ({ ship }: { ship: IShip | undefined }) => {
  return (
    <dl>
      <dt>Date</dt>
      <dd><StarDate /></dd>
      {ship ? <Details ship={ship} /> : null}
    </dl>
  )
}

export default ShipDetails