const debug = require('debug')('planet');
const Backbone = require('backbone');
const _ = require('underscore');
const shortid = require('shortid');

module.exports = class Planet extends Backbone.Model {
	constructor(attributes, options)
	{
		super(attributes, options)
		this.set({
			id: shortid.generate(),
			name: '',
			type: '',
			status: 'lifeless',
			population: 0,
			credits: 0,
			moral: 0,
			tax: 0,
			food: 0,
			materials: 20,
			fuel: 150,
			energy: 35,
			formatTime: 0
		});

		this.owner = null;
	}

	WIPterraform(player, name, primary)
	{
		this.once('terraform:complete', _.bind(this.onTerraformComplete, player, name, primary));

		this.set({
			status: 'formatting',
			formatEta: this.get('formatTime')
		});
	}

	terraform(player, name, primary, random)
	{
		// metropolis, tropical, desert, volcanic
		this.track = {
			population: [],
			credits: []
		};

		this.set({
			type: '',
			name: name,
			status: '',
			population: random.intBetween(100, 1000),
			tax: 25,
			moral: 75,
			growth: 13,
			defense: 0,
			primary: primary === true,
			formatTime: random.intBetween(8, 60)
		});

		// set primary home world start of game values (do somewhere else)
		if (primary)
		{
			this.set({
				type: 'metropolis',
				population: random.intBetween(1600, 2100),
				credits: random.intBetween(50000, 70000),
				food: random.intBetween(2500, 3500),
				materials: random.intBetween(3400, 4500),
				fuel: random.intBetween(3100, 6500),
				energy: random.intBetween(1600, 2100),
			})
		}

		this.owner = player;

		debug("Terraformed", this.id, this.get('name'), player.name);
	}

	update(date, delta)
	{
		// nothing happens to a planet if there is no owner or population
		if (this.get('status') === 'populated' && planet.get('population'))
		{
			this.updateOccupied();
		}
	}

	updateOccupied()
	{
		let population = this.get('population');
		let tax = this.get('tax');
		let moral = this.get('moral');
		let growth = this.get('growth');
		let food = this.get('food');
		let credits = this.get('credits');

		// track population and credits
		this.track.population.push(population);
		this.track.credits.push(credits);

		// update moral
		// if food runs out, moral jumps to 1%, otherwise moral increases or decreases by 1% per day - depending on the tax rate
		let targetMoral = 100 - tax;
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
			food = Math.max(Math.floor(food - (population * 0.004)), 0);
		}

		if (date.day % 2 === 0)
		{
			// apply growth every even days
			if (population !== 0)
			{
				if (growth > 0)
				{
					population += 1+Math.floor(population*(0.25*(growth/100)));
					if (population > 30000)
					{
						population = 30000;
					}
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
			console.log("Growth %i => %i", this.get('population'), population);
		}
		// apply credits every odd day
		else if (tax > 0)
		{
			// income = (0.8c per population) * tax rate
			credits += Math.floor((0.8 * population) * (tax / 100));
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
