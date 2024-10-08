import equipment from "Game/data/equipment.json"
import { Platoon } from "Game/entities"

export const calculateEquipPlatoonCost = (platoon: Platoon) =>
    platoon.size *
    ((equipment.find((item) => item.id === platoon.suit)?.cost ?? 0) +
        (equipment.find((item) => item.id === platoon.weapon)?.cost ?? 0))
