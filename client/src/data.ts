import Recoil from "recoil"
import { IUniverse, IPlanet } from "./simulation/types.d"

export const DGame = Recoil.atom<IUniverse | undefined>({
  key: "_game",
  default: undefined,
  effects: []
})

export const planetsSelector = Recoil.selector<IPlanet[]>({
	key: "_planets",
	get: ({ get }) => {
		const d = (get(DGame) as IUniverse)
		return d.planets
	}
})

export const planetSelector = Recoil.selectorFamily<IPlanet | undefined, number>({
	key: "_planet",
	get: (id) => ({ get }) => {
		const d = (get(DGame) as IUniverse)
		const planet = d.planets.find(p => p.id === id)
		// console.log(d.planets, id, planet)
		return planet
	}
})
