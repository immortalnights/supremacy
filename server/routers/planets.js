const debug = require('debug')('server');
const Core = require('./core');
const _ = require('underscore');

module.exports = class Controller extends Core {
	constructor(router)
	{
		super(router);

		router.get('/planets', _.bind(this.onGetPlanets, this));
		router.get('/planets/:id', _.bind(this.onGetPlanet, this));
	}

	onGetPlanets(request, response)
	{
		var game = this.findGame(request, response);

		if (game)
		{
			var results = this.filter(game.planets, request.get);
			const playerId = this.getPlayerId(request);

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
	}

	onGetPlanet(request, response)
	{
		var game = this.findGame(request, response);

		if (game)
		{
			var result = this.filter(game.planets, { id: request.params.id })[0];

			if (result)
			{
				const playerId = this.getPlayerId(request);

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
}
