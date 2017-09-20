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
			tax: 0,
			food: 0,
			materials: 0,
			fuel: 0,
			energy: 0
		});

		this.owner = null;
	}

	terraform(player, name, primary)
	{
		// metropolis tropical, desert, volcanic
		var type;
		if (primary === true)
		{
			type = 'metropolis';
		}

		this.set({
			type: type,
			name: name,
			population: 1950, // 1772
			tax: 25,
			moral: 75,
			growth: 13,
			credits: 0,
			food: 3400,
			materials: 3408, // 2988 4316
			fuel: 3862, // 3232 5224
			energy: 4316, // 3476 6132
			primary: primary === true
		});

		this.owner = player;

		debug("Terraformed", this.id, this.get('name'), player.name);
	}

	update(day, delta)
	{
		var population = this.get('population');
		var tax = this.get('tax');
		var moral = this.get('moral');
		var growth = this.get('growth');
		var food = this.get('food');
		var credits = this.get('credits');

		// debug("Planet updated", delta);
		// nothing happens to a planet if there is no population
		if (population)
		{
			// update moral
			// if food runs out, moral jumps to 1%, otherwise moral increases or decreases by 1% per day - depending on the tax rate
			var targetMoral = 100 - tax;
			if (food > 0)
			{
				if (moral < targetMoral)
				{
					++moral;
				}
				else (moral > targetMoral)
				{
					--moral;
				}
			}
			else
			{
				moral = 1;
			}

			// min growth is 50% @ 100% tax
			// max growth is 33% @ 0% tax
			// every 1% moral === 2% growth
			// base line 40% tax 60% moral == 0% growth

			// update the food
			if (food > 0)
			{
				food = Max.max(Math.floor(food - (population * 0.004)), 0);
			}

			if (day % 2 === 0)
			{
				// apply growth every even days
				if (population !== 0)
				{
					if (growth > 0)
					{
						population += 	1+Math.floor(population*(0.25*(growth/100)));
					}
					else if (growth < 0)
					{
						population += Math.floor(population*(0.25*(growth/100)));
						if (population < 0)
						{
							population = 0;
						}
					}
				}
			}
			// apply credits every odd day
			else if (tax > 0)
			{
				// income = (0.8c per population) * tax rate
				credits += Math.floor((0.8 * population) * (tax / 100));
			}
		}

		this.set({
			population: population,
			tax: tax,
			moral: moral,
			growth: growth,
			food: food,
			credits: credits
		});
	}
};
