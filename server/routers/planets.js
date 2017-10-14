const debug = require('debug')('server');
const Core = require('./core');
const _ = require('underscore');

/**
 * Handles Planets related API routes
 */
module.exports = class Controller extends Core {
	constructor(router)
	{
		super(router);

		this.register.get('/planets',                      this.onGetPlanets);
		this.register.get('/planets/:id',                  this.onGetPlanet);
		this.register.put('/planets/:id/terraform/invoke', this.onTerraformPlanet);
	}

	onGetPlanets(request, response, server)
	{
		console.assert(server);

		const playerId = request.cookies.playerId;
		var results = server.game.planets.map(function(planet) {
			let data;
			if (planet.owner && planet.owner.id === playerId)
			{
				data = planet.toJSON();
			}
			else
			{
				data = planet.pick('id');

				if (planet.owner)
				{
					if (planet.get('primary'))
					{
						data.name = 'EnemyBase';
					}
					else
					{
						data.name = 'Classified';
					}
				}
				else if (planet.get('status') === 'terraforming')
				{
					data.name = 'Formatting';
				}
				else
				{
					data.name = 'Lifeless!';
				}
			}

			return data;
		});

		this.writeResponse(response, 200, _.where(results, request.get));
	}

	onGetPlanet(request, response, server)
	{
		console.assert(server);

		var game = server.game;
		var result = game.planets.get(request.params.id);

		if (result)
		{
			const playerId = request.cookies.playerId;

			if (!result.owner)
			{
				this.writeResponse(response, 403, "This planet is unoccupied");
			}
			else if (result.owner.id !== playerId)
			{
				this.writeResponse(response, 403, "You do not have access to view this planet.");
			}
			else
			{
				// augment the data with the game date
				var data = result.toJSON();
				data.date = game.get('date');

				this.writeResponse(response, 200, data);
			}
		}
		else
		{
			this.writeResponse(response, 404, "Planet '" + request.params.id + "' does not exist");
		}
	}

	onTerraformPlanet(request, response, server)
	{
		console.assert(server);

		try
		{
			const playerId = request.cookies.playerId;
			let game = server.game;
			let planet = game.planets.get(request.params.id);

			if (!planet)
			{
				this.writeResponse(response, 404, "Failed to find planet '" + request.body.planet + "'.");
			}
			else if (planet.owner)
			{
				if (planet.owner.id === playerId)
				{
					this.writeResponse(response, 400, "Planet '" + planet.id + "' is owned by you.");
				}
				else
				{
					this.writeResponse(response, 400, "Planet '" + planet.id + "' is owned by the enemy.");
				}
			}
			else if (planet.get('status') === 'terraforming')
			{
				this.writeResponse(response, 400, "Planet '" + planet.id + "' is already been terraformed.");
			}
			else
			{
				let atmos = game.ships.find(function(ship) {
					return ship.get('type') === 'atmos' && ship.owner.id === playerId;
				});

				if (!atmos)
				{
				this.writeResponse(response, 404, "You need an Atmosphere Processor.");

				}
				else if (atmos.get('status') === 'terraforming')
				{
					let location = atmos.get('location');
					this.writeResponse(response, 400, "Atmosphere Processor is terraforming another planet.");
				}
				else
				{
					let location = atmos.get('location');
					let details = game.getTravelDetails(location.planet, planet.id);

					planet.set('status', 'terraforming')

					atmos.set({
						status: 'terraforming',
						location: {
							planet: null,
							position: null
						},
						travel: {
							planet: planet.id,
							eta: details.eta
						}
					});
				}
			}
		}
		catch (err)
		{
			this.writeResponse(response, 500, err);
		}
	}
}
