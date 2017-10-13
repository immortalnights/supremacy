const debug = require('debug')('ship');
const Backbone = require('backbone');
const _ = require('underscore');
const shortid = require('shortid');

module.exports = class Ship extends Backbone.Model {
	constructor(attributes, options)
	{
		super(attributes, options)
		this.set({
			id: shortid.generate(),
			crew: 0,
			fuel: 0,
			passengers: 0,
			value: 0,
			payload: null,
			location: {
				// can be null when traveling
				planet: undefined,
				// surface, dock, orbit
				position: undefined
			}
		});

		this.owner = null;

		debug("Ship constructed");
	}

	update(delta)
	{
		// debug("Ship updated", delta);
		let value = this.get('value');
		if (value > 0)
		{
			this.set('value', --value);
		}
	}

	/**
	 * @returns true or error string
	 */
	moveTo(position, toPlanet)
	{
		var result;
		var planet = this.get('location').planet;

		switch (position)
		{
			// orbit / surface to dock
			case 'dock':
			{
				// If the ship is at a planet
				if (planet)
				{
					this.setLocation(planet, 'dock');
					result = true;
				}
				else
				{
					result = "Ship is not at a planet";
				}
				break;
			}
			// surface / dock to orbit
			case 'orbit':
			{
				// If the ship is at a planet
				if (planet)
				{
					this.setLocation(planet, 'orbit');
					result = true;
				}
				else
				{
					result = "Ship is not at a planet";
				}
				break;
			}
			// dock / orbit to surface
			case 'surface':
			{
				// If the ship is at a planet
				if (planet)
				{
					this.setLocation(planet, 'surface');
					result = true;
				}
				else
				{
					result = "Ship is not at a planet";
				}
				break;
			}
			// orbit to another planet
			case 'planet':
			{
				// If the ship is at a planet
				if (planet)
				{
					result = "Ships cannot travel yet...";
				}
				else
				{
					result = "Ship is not at a planet";
				}
				break;
			}
			default:
			{
				result = "Invalid target position";
				break;
			}
		}

		return result;
	}

	setLocation(planet, position)
	{
		this.set('location', {
			planet: planet,
			position: position
		});
	}
};
