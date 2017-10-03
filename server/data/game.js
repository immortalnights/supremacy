const debug = require('debug')('game');
const Backbone = require('backbone');
const _ = require('underscore');
const shortid = require('shortid');
const Planets = require('./planets');
const Ships = require('./ships');

module.exports = class Game extends Backbone.Model {
	constructor(name, type, seed)
	{
		super();
		this.set({
			id: shortid.generate(),
			name: name,
			type: type,
			status: 'eWAITING_FOR_PLAYERS',
			date: {
				day: 1,
				year: 2010
			},
			seed: seed || Math.random()
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
			let day = date.day++;
			let year = date.year;
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
		this.set('date', date);

		// update all plants
		this.planets.each((planet) => {
			planet.update(date, delta);
		});

		// update all ships
		this.ships.each((ship) => {
			ship.update(date, delta);
		});
	}
}
