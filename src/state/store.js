import { atom, atomFamily } from 'recoil'

const game = atom({
	key: 'game',
	default: {
		id: null,
		planets: 0
	}
})

const date = atom({
	key: 'date',
	default: { m: 1, y: 2050 }
})

const planets = atomFamily({
	key: 'planets',
	default: id => null
})

const ships = atomFamily({
	key: 'ships',
	default: id => null
})

const platoons = atom({
	key: 'platoons',
	default: []
})

export default { game, date, planets, ships, platoons }