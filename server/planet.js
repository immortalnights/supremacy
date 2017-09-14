const debug = require('debug')('planet');
const EventEmitter = require('events');
const _ = require('underscore');

class Planet extends EventEmitter
{
	constructor(options)
	{
		super()
		this.id = undefined;
		this.name = 'Undefined';
		this.type = 'Unknown';
		this.owner = null;
		this.population = 0;
		this.moral = 0;
		this.taxRate = 0;
		this.food = 0;
		this.materials = 0;
		this.fuel = 0;
		this.energy = 0;

		_.extend(this, options);

		debug("Planet constructed");
	}

	terraform(player, attributes)
	{
		this.type = 'metropolis'; // tropical, desert, volcanic
		this.name = _.isString(attributes) ? attributes : '';
		this.owner = player;

		this.population = 1950; // 1772
		this.taxRate = 25;
		this.moral = 75;

		this.credits = 0;
		this.food = 3400; 
		this.materials = 3408; // 2988 4316
		this.fuel = 3862; // 3232 5224
		this.energy = 4316; // 3476 6132

		if (_.isObject(attributes))
		{
			_.extend(this, attributes);
		}

		debug("Terraformed", this.id, this.name, player.name);
	}

	get attributes()
	{
		return _.pick(this, 'id', 'name', 'type', 'population', 'taxRate', 'moral', 'credits', 'food', 'materials', 'fuel', 'energy');
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

module.exports = Planet;
