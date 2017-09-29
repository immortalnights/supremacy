const debug = require('debug')('server');
const Core = require('./core');
const _ = require('underscore');

/**
 * Handles Blueprints related API routes
 */
module.exports = class ShopContoller extends Core {
	constructor(router)
	{
		super(router);

		router.get('/blueprints', _.bind(this.onGetBlueprints, this));
		router.get('/blueprints/:id', _.bind(this.onGetBlueprint, this));
		router.post('/blueprints/:id/build/invoke', _.bind(this.onBuild, this));
	}

	onGetBlueprints(request, response)
	{
		var game = this.findGame(request, response);

		if (game)
		{
			this.onGetList(game.blueprints, request, response);
		}
	}

	onGetBlueprint(request, response)
	{
		var game = this.findGame(request, response);

		if (game)
		{
			this.onGetSingle(game.blueprints, request, response);
		}
	}

	onBuild(request, response)
	{
		var game = this.findGame(request, response);

		if (game)
		{
			var blueprint = this.filter(game.blueprints, { id: request.params.id })[0];

			if (blueprint)
			{
				const playerId = this.getPlayerId(request);

				const ship = game.buildShip(blueprint, playerId);

				this.writeResponse(response, 201, ship);
			}
			else
			{
				this.writeResponse(response, 404, "Blueprint " + request.params.id + " does not exist.");
			}
		}
	}
}
