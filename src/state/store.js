import { atom } from 'recoil'

const date = atom({
	key: 'date',
	default: { m: 1, y: 2050 }
})

const planets = atom({
	key: 'planets',
	default: []
})

const platoons = atom({
	key: 'platoons',
	default: []
})

export default { date, planets, platoons }