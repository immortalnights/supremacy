const debug = require('debug')('ship');
const Backbone = require('backbone');
const _ = require('underscore');
const shortid = require('shortid');

module.exports = class Blueprints extends Backbone.Collection {
	constructor(models, options)
	{
		super(models, options)

		this.set([
			{
				id: shortid.generate(),
				class: 'B-29 Battle Cruiser',
				shortName: 'Battle',
				type: 'cruiser',
				desc: "Carries four fully equipped platoons into battle.",
				cost: {
					credits: 5250,
					materials: 95,
					energy: 365
				},
				capacity: 600,
				requiredCrew: 21,
				maximumFuel: 1000,
				seats: 4500,
				range: 2000
			},

			{
				id: shortid.generate(),
				class: 'Solar-sat',
				shortName: 'Solar',
				type: 'generator',
				desc: "Transmits solar energy back to the planet from orbit.",
				cost: {
					credits: 975,
					materials: 7,
					energy: 92
				},
				capacity: 0,
				requiredCrew: 0,
				maximumFuel: 0,
				seats: 0,
				range: 0
			},

			{
				id: shortid.generate(),
				class: 'Atmosphere Processor',
				shortName: 'Atmos',
				type: 'atmos',
				desc: "Generates new living planets from lifeless ones.",
				cost: {
					credits: 26753,
					materials: 75,
					energy: 999
				},
				capacity: 0,
				requiredCrew: 0,
				maximumFuel: 0,
				seats: 0,
				range: 0
			},

			{
				id: shortid.generate(),
				class: 'Carrier',
				shortName: 'Cargo',
				type: 'carrier',
				desc: "Deep space heavy duty cargo / personnel carrier.",
				cost: {
					credits: 15400,
					materials: 125,
					energy: 465
				},
				capacity: 2250,
				requiredCrew: 11,
				maximumFuel: 1250,
				seats: 1850,
				range: 3750
			},

			{
				id: shortid.generate(),
				class: 'Mining Station',
				shortName: 'Mining',
				type: 'mining',
				desc: "Generates fuels and minerals when running on surface.",
				cost: {
					credits: 17999,
					materials: 600,
					energy: 875
				},
				capacity: 950,
				requiredCrew: 294,
				maximumFuel: 1400,
				seats: 0,
				range: 4200
			},

			{
				id: shortid.generate(),
				class: 'Horticultural Station',
				shortName: 'Farming',
				type: 'horticultural',
				desc: "Generates food supplies when running on surface.",
				cost: {
					credits: 16995,
					materials: 540,
					energy: 970
				},
				capacity: 950,
				requiredCrew: 175,
				maximumFuel: 750,
				seats: 0,
				range: 3000
			},

			// {
			// 	class: '',
			// 	type: '',
			// 	desc: "",
			// 	cost: {
			// 		credits: 0,
			// 			materials: 0,
			// 			energy: 0
			// 	},
			// 	capacity: 0,
			// 	requiredCrew: 0,
			// 	maximumFuel: 0,
			// 	seats: 0,
			// 	range: 0
			// },
		]);
	}
}
