import { EquippedPlatoon, StandbyPlatoon } from "Supremacy/entities"
import { colonizedPlanet } from "./planets"

export const standbyPlatoon: StandbyPlatoon = {
    id: "",
    index: 0,
    owner: "local",
    state: "standby",
    size: 0,
    calibre: 0,
    weapon: "rifle",
    suit: "basic",
}

export const equippedPlatoon: EquippedPlatoon = {
    id: "",
    index: 0,
    owner: "local",
    state: "equipped",
    size: 0,
    calibre: 0,
    weapon: "rifle",
    suit: "basic",
    location: {
        planet: colonizedPlanet.id,
        index: 0,
    },
}
