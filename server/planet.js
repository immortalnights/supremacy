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
		this.energy = 0;
		this.fuel = 0;
		this.materials = 0;

		_.extend(this, options);

		debug("Planet constructed");
	}

	terraform(player, attributes)
	{
		this.type = 'metropolis'; // tropical, desert, volcanic
		this.name = _.isString(attributes) ? attributes : '';
		this.owner = player;
		this.population = 1000;
		this.taxRate = 25;
		this.moral = 100;
		// this.energy;
		// this.fuel;
		// this.materials;

		if (_.isObject(attributes))
		{
			_.extend(this, attributes);
		}

		debug("Terraformed", this.id, this.name, player.name);
	}

	get attributes()
	{
		return _.pick(this, 'id', 'name', 'type', 'population', 'moral', 'taxRate', 'energy', 'fuel', 'materials');
	}

	update(delta)
	{
		// debug("Planet updated", delta);
	}
};

module.exports = Planet;
