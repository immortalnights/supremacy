import React from "react"
import Recoil from "recoil"
import { IPlanet, IShip } from "../../simulation/types.d"

const ShipProperties = ({ planet, ship }: { planet: IPlanet, ship?: IShip }) => {
  const details: {
    name?: string
    civilians?: number
    seats?: number
    crew?: number
    requiredCrew?: number
    crewText?: string
    capacity?: {
      civilians?: number
      cargo?: number
      fuel?: string | number
    }
    maxFuel?: number | string
    payload?: number
    value?: number
  } = {}

  if (ship)
  {
    details.name = ship.name
    details.crew = ship.crew
    details.requiredCrew = ship.requiredCrew
    details.capacity = { ...ship.capacity }
    // FIXME
    // details.payload = Object.keys(ship.cargo).reduce((mem, key) => (mem + ship.cargo[key]), 0)
    details.value = ship.value

    if (ship.requiredCrew > 0)
    {
      details.crewText = details.crew + ' / ' + details.requiredCrew
    }
    else
    {
      details.crewText = "remote"
    }

    details.maxFuel = details.capacity ? details.capacity.fuel : "Nuclear"
  }

  return (
    <dl>
      <dt>Ship</dt>
      <dd>{details.name}</dd>
      <dt>Civilians</dt>
      <dd>{details?.civilians?.toFixed(0)}</dd>
      <dt>Seats</dt>
      <dd>{details?.capacity?.civilians}</dd>
      <dt>Crew</dt>
      <dd>{details.crewText}</dd>
      <dt>Capacity</dt>
      <dd>{details?.capacity?.cargo}</dd>
      <dt>Max Fuel</dt>
      <dd>{details.maxFuel}</dd>
      <dt>Payload</dt>
      <dd>{details.payload}</dd>
      <dt>Value</dt>
      <dd>{details.value}</dd>
    </dl>
  )
}

export default ShipProperties