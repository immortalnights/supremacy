import Recoil from "recoil"
import { IShip, IShipBasic, PlanetID } from "../simulation/types.d"
import { IPlayer, Player } from "./Player"

export type { IShip, IShipBasic }

export const Ships = Recoil.atom<(IShipBasic | IShip)[]>({
    key: "Ships",
    default: [],
})

export const PlayerShips = Recoil.selector<IShip[]>({
    key: "PlayerShips",
    get: ({ get }) => {
        const player = get(Player) as IPlayer
        const ships = get(Ships) as IShip[]
        return ships.filter((s) => s.owner === player.id)
    }
})

export const PlayerShipsAtPlanetPosition = Recoil.selectorFamily<IShip[], { planet: PlanetID, position: string }>({
    key: "PlayerShipsAt",
    get: ({ planet, position }) => ({ get }) => {
        const ships = get(PlayerShips) as IShip[]
        return ships.filter((s) => s.location.planet === planet && s.location.position === position)
    }
})