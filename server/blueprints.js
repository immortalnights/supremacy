const debug = require('debug')('ship');
const EventEmitter = require('events');
const _ = require('underscore');

class Blueprints extends EventEmitter
{
	constructor()
	{
		super()
	}

	get available()
	{
		return [
			{
				id: 0,
				name: 'B-29 Battle Cruiser',
				type: 'cruiser',
				desc: "Carries four fully equipped platoons into battle.",
				cost: 5250,
				capacity: 600,
				payload: null,
				requiredCrew: 21,
				maximumFuel: 1000
			},

			{
				id: 1,
				name: 'Solar-sat',
				type: 'generator',
				desc: "Transmits solar energy back to the planet from orbit.",
				cost: 975,
				capacity: 0,
				payload: null,
				requiredCrew: 0,
				maximumFuel: 0
			},

			{
				id: 2,
				name: 'Atmosphere Processor',
				type: 'atmos',
				desc: "Generates new living planets from lifeless ones.",
				cost: 26753,
				capacity: 0,
				payload: null,
				requiredCrew: 0,
				maximumFuel: 0
			},

			{
				id: 3,
				name: 'Carrier',
				type: 'carrier',
				desc: "Deep space heavy duty cargo / personnel carrier.",
				cost: 15400,
				capacity: 2250,
				payload: null,
				requiredCrew: 11,
				maximumFuel: 1250
			},

			{
				id: 4,
				name: 'Mining Station',
				type: 'mining',
				desc: "Generates fuels and minerals when running on surface.",
				cost: 17999,
				capacity: 950,
				payload: null,
				requiredCrew: 294,
				maximumFuel: 1400
			},

			{
				id: 5,
				name: 'Horticultural Station',
				type: 'horticultural',
				desc: "Generates food supplies when running on surface",
				cost: 16995,
				capacity: 950,
				payload: null,
				requiredCrew: 175,
				maximumFuel: 750
			},

			// {
			// 	name: '',
			// 	type: '',
			// 	desc: "",
			// 	cost: 0,
			// 	capacity: 0,
			// 	payload: null,
			// 	requiredCrew: 0,
			// 	maximumFuel: 0
			// },
		];
	}
}

module.exports = Blueprints;
