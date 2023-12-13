import Recoil from "recoil"
import { IShip, IShipBasic, PlanetID, ShipID } from "@server/simulation/types"
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
        const ships = get(Ships)
        return ships.filter((s) => s.owner === player.id) as IShip[]
    },
})

export const Ship = Recoil.selectorFamily<
    IShip | undefined,
    ShipID | undefined
>({
    key: "SelectedShip",
    get:
        (id: ShipID | undefined) =>
        ({ get }) => {
            const ships = get(PlayerShips)
            return ships.find((s) => s.id === id)
        },
})

export const PlayerShipsAtPlanetPosition = Recoil.selectorFamily<
    IShip[],
    { planet: PlanetID | undefined; position: string | string[] }
>({
    key: "PlayerShipsAt",
    get:
        ({ planet, position }) =>
        ({ get }) => {
            const ships = get(PlayerShips)
            const positions: string[] = Array.isArray(position)
                ? position
                : [position]
            return ships.filter(
                (s) =>
                    planet !== undefined &&
                    s.location.planet === planet &&
                    positions.includes(s.location.position)
            )
        },
})
