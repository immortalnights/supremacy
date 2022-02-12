import { atom, atomFamily } from 'recoil'

export const GAME_START_YEAR = 2050

const game = atom({
	key: 'game',
	default: null,
	persistence_UNSTABLE : {
		type: 'object'
	}
})

const memory = atom({
	key: 'memory',
	default: {},
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
	default: { d: 1, y: GAME_START_YEAR },
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

export default { game, memory, settings, date, GAME_START_YEAR, planets, ships, platoons }