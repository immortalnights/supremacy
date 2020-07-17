import cloneDeep from 'lodash/cloneDeep';

export const createShip = (blueprint, id, name, player, planet) => {
	const ship = {
		id,
		owner: player.id,
		name: name,
		location: {
			planet: planet.id,
			position: 'docked'
		},
		crew: 0,
		fuel: 0,
		cargo: {
			'civilians': 0,
			'cargo': 0,
			'fuel': 0,
			'platoons': []
		},
		...cloneDeep(blueprint)
	}

	return ship
}