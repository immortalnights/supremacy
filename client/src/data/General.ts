import Recoil from "recoil"
import { IDate } from "../simulation/types.d"

export const SelectedPlanetID = Recoil.atom<number>({
  key: "selectedPlanetID",
  default: -1
})

export const formatDate = ({ day, year }: IDate) => {
  return `${day} / ${year}`
}