import { atom, atomFamily } from 'recoil'

const game = atom({
	key: 'game',
	default: {
		id: null,
		players: null,
		planets: 0
	}
})

const date = atom({
	key: 'date',
	default: { m: 1, y: 2050 }
})

const planets = atomFamily({
	key: 'planets',
	default: []
})

const ships = atomFamily({
	key: 'ships',
	default: []
})

const platoons = atomFamily({
	key: 'platoons',
	default: []
})

export default { game, date, planets, ships, platoons }