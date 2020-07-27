import { atom, atomFamily } from 'recoil'

const game = atom({
	key: 'game',
	default: null
})

const date = atom({
	key: 'date',
	default: { d: 1, y: 2050 }
})

const planets = atomFamily({
	key: 'planets',
	default: null
})

const ships = atomFamily({
	key: 'ships',
	default: null
})

const platoons = atomFamily({
	key: 'platoons',
	default: null
})

export default { game, date, planets, ships, platoons }