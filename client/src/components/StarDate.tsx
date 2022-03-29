import React from "react"
import Recoil from "recoil"
import { SolarSystem as SolarSystemData } from "../data/SolarSystem"
import type { ISolarSystem } from "../simulation/types.d"
import { formatDate } from "../data/General"

export const StarDate = () => {
  const data = Recoil.useRecoilValue(SolarSystemData) as ISolarSystem

  return (
    <div>{data ? formatDate(data.date) : "-"}</div>
  )
}