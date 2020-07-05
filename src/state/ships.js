import { atom } from 'recoil'
import ShipData from '../data/ships.json'

const shipsAtom = atom({
	key: 'ships',
	default: ShipData
})

export default shipsAtom