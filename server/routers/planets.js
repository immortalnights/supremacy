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

		this.register.get('/planets',     this.onGetPlanets);
		this.register.get('/planets/:id', this.onGetPlanet);
	}

	onGetPlanets(request, response, server)
	{
		console.assert(server);

		var game = server.game;
		var results = this.filter(game.planets, request.get);
		const playerId = request.cookies.playerId;

		results = _.map(results, function(item) {
			if (item.owner && item.owner.id === playerId)
			{
				return item.toJSON();
			}
			else
			{
				return item.pick('id', 'name');
			}
		});

		this.writeResponse(response, 200, results);
	}

	onGetPlanet(request, response, server)
	{
		console.assert(server);

		var game = server.game;
		var result = this.filter(game.planets, { id: request.params.id })[0];

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
}
