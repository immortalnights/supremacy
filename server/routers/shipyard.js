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

		this.register.get('/blueprints',                   this.onGetBlueprints);
		this.register.get('/blueprints/:id',               this.onGetBlueprint);
		this.register.post('/blueprints/:id/build/invoke', this.onBuild);
	}

	onGetBlueprints(request, response)
	{
		var server = this.findServer(request, response);

		if (server)
		{
			this.onGetList(server.game.blueprints, request, response);
		}
	}

	onGetBlueprint(request, response)
	{
		var server = this.findServer(request, response);

		if (server)
		{
			this.onGetSingle(server.game.blueprints, request, response);
		}
	}

	onBuild(request, response)
	{
		var server = this.findServer(request, response);

		if (server)
		{
			var game = server.game;
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
