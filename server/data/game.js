const debug = require('debug')('game');
const Backbone = require('backbone');
const _ = require('underscore');
const shortid = require('shortid');
const Planets = require('./planets');
const Ships = require('./ships');

module.exports = class Game extends Backbone.Model {
	constructor(name, type, random)
	{
		super();
		this.random = random;
		this.set({
			id: shortid.generate(),
			name: name,
			type: type,
			status: 'eWAITING_FOR_PLAYERS',
			date: {
				day: 1,
				year: 2010
			}
		});

		debug("Game created", this.id);
	}

	get planets()
	{
		return this._planets;
	}

	get ships()
	{
		return this._ships;
	}

	setup(options)
	{
		// Collection of planets
		this._planets = new Planets();
		// Collection of ships
		this._ships = new Ships();

		// Initialize planets
		this.planets.set(_.map(_.range(options.size), function(index) { return {}; }));
		debug("Game %s setup (%i)", this.id, this.planets.length);
	}

	tick(delta)
	{
		const incDate = function(date) {
			let day = date.day;
			let year = date.year;

			++day;

			if (date.day === 65)
			{
				++year;
				day = 1;
			}

			return {
				day: day,
				year: year
			};
		}

		var date = incDate(this.get('date'));
		console.log("game tick", date);
		this.set('date', date);

		// update all plants
		this.planets.each((planet) => {
			planet.update(date, delta);
		});

		// update all ships
		this.ships.each((ship) => {
			let type = ship.get('type');
			let location = ship.get('location');
			let planet = this.planets.get(location.planet);

			if (planet)
			{
				// TODO account for bonuses / events
				if (type === 'generator' && location.position === 'orbit')
				{
					let energy = planet.get('energy');
					planet.set('energy', energy + 50);
				}
				else if (location.position === 'surface')
				{
					if (type === 'horticultural')
					{
						let food = planet.get('food');
						planet.set('food', food + 12);
					}
					else if (type === 'mining')
					{
						let materials = planet.get('materials');
						planet.set('materials', materials + 50);
					}
				}
			}

			ship.update(date, delta);
		});
	}
}
