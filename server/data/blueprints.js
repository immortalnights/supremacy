const debug = require('debug')('ship');
const Backbone = require('backbone');
const _ = require('underscore');
const shortid = require('shortid');

module.exports = class Blueprints extends Backbone.Collection {
	constructor()
	{
		super()

		this.set([
			{
				id: shortid.generate(),
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
				id: shortid.generate(),
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
				id: shortid.generate(),
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
				id: shortid.generate(),
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
				id: shortid.generate(),
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
				id: shortid.generate(),
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
		]);
	}
}
