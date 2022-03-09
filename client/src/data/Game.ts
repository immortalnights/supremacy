import Recoil from "recoil"

export interface IGame {
    id: string
    player: string
    lastSaved: string
}

export const AGame = Recoil.atom<IGame | undefined>({
    key: 'a_game',
    default: undefined,
})