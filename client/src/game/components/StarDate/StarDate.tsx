import React from "react"
import Recoil from "recoil"
import { SolarSystem as SolarSystemData, ISolarSystem } from "../../../data/SolarSystem"
import { formatDate } from "../../../data/General"
import { IDate } from "../../../simulation/types.d"

export const StarDate = ({ date }: { date: IDate }) => {
  return (<span>{formatDate(date)}</span>)
}

const CurrentStarDate = () => {
  const data = Recoil.useRecoilValue(SolarSystemData) as ISolarSystem

  return (data ? <StarDate date={data.date} /> : <span>-</span>)
}

export default CurrentStarDate