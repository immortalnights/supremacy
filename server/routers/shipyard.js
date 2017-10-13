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

	onGetBlueprints(request, response, server)
	{
		console.assert(server);

		this.onGetList(server.blueprints, request, response);
	}

	onGetBlueprint(request, response, server)
	{
		console.assert(server);

		this.onGetSingle(server.blueprints, request, response);
	}

	onBuild(request, response, server)
	{
		console.assert(server);

		var blueprint = server.blueprints.get(request.params.id);

		if (blueprint)
		{
			const playerId = request.cookies.playerId;

			try
			{
				const ship = server.buildShip(blueprint, playerId);
				this.writeResponse(response, 201, ship);
			}
			catch (err)
			{
				console.error(err);
				this.writeResponse(response, 400, err);
			}
		}
		else
		{
			this.writeResponse(response, 404, "Blueprint " + request.params.id + " does not exist.");
		}
	}
}
