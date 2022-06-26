import Recoil from "recoil"
import { StarDate } from "../simulation/types.d"

const DAYS_PER_YEAR = 48

export const SelectedPlanetID = Recoil.atom<number>({
  key: "selectedPlanetID",
  default: -1
})

export const formatDate = (date: StarDate) => {
  const year = 2100 + Math.floor(date / DAYS_PER_YEAR)
  const day =  Math.floor(date % DAYS_PER_YEAR)
  return `${day} / ${year}`
}