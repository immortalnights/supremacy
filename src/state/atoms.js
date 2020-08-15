import { atom, atomFamily } from 'recoil'

const game = atom({
	key: 'game',
	default: null,
	persistence_UNSTABLE : {
		type: 'object'
	}
})

const settings = atom({
	key: 'settings',
	default: {
		speed: 1000
	},
	persistence_UNSTABLE : {
		type: 'object'
	}
})

const date = atom({
	key: 'date',
	default: { d: 1, y: 2050 },
	persistence_UNSTABLE : {
		type: 'object'
	}
})

const planets = atomFamily({
	key: 'planets',
	default: null,
	persistence_UNSTABLE : {
		type: 'array'
	}
})

const ships = atomFamily({
	key: 'ships',
	default: null,
	persistence_UNSTABLE : {
		type: 'array'
	}
})

const platoons = atomFamily({
	key: 'platoons',
	default: null,
	persistence_UNSTABLE : {
		type: 'array'
	}
})

export default { game, settings, date, planets, ships, platoons }