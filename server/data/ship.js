const debug = require('debug')('ship');
const Backbone = require('backbone');
const _ = require('underscore');

module.exports = class Ship extends Backbone.Model {
	constructor(options)
	{
		super()
		this.id = undefined;
		this.name = 'Undefined';
		this.type = 'Unknown';
		this.owner = null;
		this.location = {
			// can be null when traveling
			planet: undefined,
			// surface, dock, orbit
			position: undefined
		};

		_.extend(this, options);

		debug("Ship constructed");
	}

	get attributes()
	{
		return _.pick(this, 'id', 'name', 'type', 'location');
	}

	update(delta)
	{
		// debug("Ship updated", delta);
	}

	moveTo(position, toPlanet)
	{
		return new Promise((resolve, reject) => {
			switch (position)
			{
				// orbit / surface to dock
				case 'dock':
				{
					// If the ship is at a planet
					if (this.location.planet)
					{
						this.location.position = 'dock';
						resolve(this);
					}
					else
					{
						reject("Ship is not at a planet");
					}
					break;
				}
				// surface / dock to orbit
				case 'orbit':
				{
					// If the ship is at a planet
					if (this.location.planet)
					{
						this.location.position = 'orbit';
						resolve(this);
					}
					else
					{
						reject("Ship is not at a planet");
					}
					break;
				}
				// dock / orbit to surface
				case 'surface':
				{
					// If the ship is at a planet
					if (this.location.planet)
					{
						this.location.position = 'surface';
						resolve(this);
					}
					else
					{
						reject("Ship is not at a planet");
					}
					break;
				}
				// orbit to another planet
				case 'planet':
				{
					// If the ship is at a planet
					if (this.location.planet)
					{
						reject("Ships cannot travel yet...");
					}
					else
					{
						reject("Ship is not at a planet");
					}
					break;
				}
				default:
				{
					reject("Invalid target position");
					break;
				}
			}
		});
	}
};