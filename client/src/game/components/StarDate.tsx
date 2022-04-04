import React from "react"
import Recoil from "recoil"
import { SolarSystem as SolarSystemData, ISolarSystem } from "../../data/SolarSystem"
import { formatDate } from "../../data/General"

export const StarDate = () => {
  const data = Recoil.useRecoilValue(SolarSystemData) as ISolarSystem

  return (
    <div>{data ? formatDate(data.date) : "-"}</div>
  )
}