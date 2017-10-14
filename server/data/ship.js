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

		let type = this.get('type');
		if (type === 'atmos' || type === 'generator')
		{
			this.set('fuel', 'nuclear');
		}

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

		let travel = this.get('travel');
		if (travel)
		{
			let fuel = this.get('fuel');
			if (fuel !== 'nuclear')
			{
				this.set('fuel', fuel - 50);
			}

			// reduce the eta
			--travel.eta;

			// check arrived
			if (travel.eta === 0)
			{
				let data = {
					location: {
						planet: travel.planet,
						position: 'surface'
					},
					travel: null
				};

				if (this.get('type') === 'atmos')
				{
					// land automatically
					data.location.position = 'surface';
				}

				this.set(data);
			}
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
