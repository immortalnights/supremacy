const debug = require('debug')('planet');
const Backbone = require('backbone');
const _ = require('underscore');
const shortid = require('shortid');

module.exports = class Planet extends Backbone.Model {
	constructor(options)
	{
		super()
		this.set({
			id: shortid.generate(),
			name: 'Undefined',
			type: 'Unknown',
			population: 0,
			moral: 0,
			taxRate: 0,
			food: 0,
			materials: 0,
			fuel: 0,
			energy: 0
		});

		this.owner = null;

		debug("Planet constructed");
	}

	terraform(player, attributes)
	{
		this.set({
			type: 'metropolis', // tropical, desert, volcanic
			name: _.isString(attributes) ? attributes : '',

			population: 1950, // 1772
			taxRate: 25,
			moral: 75,

			credits: 0,
			food: 3400,
			materials: 3408, // 2988 4316
			fuel: 3862, // 3232 5224
			energy: 4316, // 3476 6132
		});

		this.owner = player;

		if (_.isObject(attributes))
		{
			this.set(attributes);
		}

		debug("Terraformed", this.id, this.get('name'), player.name);
	}

	update(day, delta)
	{
		// debug("Planet updated", delta);
		// nothing happens to a planet if there is no population
		if (this.population)
		{
			// update moral
			// if food runs out, moral jumps to 1%, otherwise moral increases or decreases by 1% per day - depending on the tax rate
			var targetMoral = 100 - this.taxRate;
			if (this.food > 0)
			{
				if (this.moral < targetMoral)
				{
					++this.moral;
				}
				else (this.moral > targetMoral)
				{
					--this.moral;
				}
			}
			else
			{
				this.moral = 1;
			}

			// max growth is 50% @ 100% tax
			// every 1% moral === 2% growth
			// base line 40% tax 60% moral == 0% growth



			// update the food

			// apply growth every even days

			// apply credits every odd day
			if (day % 2 !== 0)
			{
				// income = (0.8c per population) * tax rate
				this.credits += Math.floor((0.8 * this.population) * (this.taxRate / 100));
			}
		}
	}
};
