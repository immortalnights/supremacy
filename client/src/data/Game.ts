import Recoil from "recoil"

export interface IGame {
    id: string
    playerID: string
    roomID: string
    lastSaved: string
}

export const AGame = Recoil.atom<IGame | undefined>({
    key: 'another_game',
    default: undefined,
})