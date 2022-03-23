import Recoil from "recoil"
import { ISolarSystem, IDate } from "../simulation/types.d"

export type { ISolarSystem }

export const SolarSystem = Recoil.atom<ISolarSystem | undefined>({
    key: "solarsystem",
    default: undefined,
})

export const SelectedPlanet = Recoil.atom<number>({
    key: "selectedPlanet",
    default: -1
})

export const formatDate = ({ day, year }: IDate) => {
    return `${day} / ${year}`
}