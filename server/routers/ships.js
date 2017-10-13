const debug = require('debug')('server');
const Core = require('./core');
const _ = require('underscore');

const formatLocationSumamry = function(ship, planet) {
	var result = "";
	switch (ship.location.position)
	{
		case 'dock':
		{
			result = ship.name + " is in a docking bay on " + planet.name;
			break;
		}
		case 'orbit':
		{
			result = ship.name + " is now in orbit above " + planet.name;
			break;
		}
		case 'transit':
		{
			result = ship.name + " is now in transit to " + planet.name;
			break;
		}
		case 'surface':
		{
			result = ship.name + " is on the surface of " + planet.name;
			break;
		}
	}
	return result;
}

const updateShipLocationSummary = function(ship, planets) {
	var planet = _.findWhere(planets, { id: ship.location.planet });
	console.assert(planet);
	ship.location.summary = formatLocationSumamry(ship, planet);
}

/**
 * Handles Ships related API routes
 */
module.exports = class ShipContoller extends Core {
	constructor(router)
	{
		super(router);

		this.register.get('/ships',                    this.onGetShips);
		this.register.get('/ships/:id',                this.onGetShip);
		this.register.put('/ships/:id/:action/invoke', this.onShipAction);
	}

	onGetShips(request, response, server)
	{
		console.assert(server);
		this.onGetList(server.game.ships, request, response);
	}

	onGetShip(request, response, server)
	{
		console.assert(server);
		this.onGetSingle(server.game.ships, request, response);
	}

	onShipAction(router, game, server)
	{
		console.assert(server);

		var game = server.game;
		var result = game.ships.filterByParam({ id: request.params.id })[0];

		if (result && result.owner === game.getPlayer())
		{
			var result;
			switch (request.params.action)
			{
				case 'launch':
				{
					result = result.moveTo('orbit');
					break;
				}
				case 'land':
				{
					result = result.moveTo('surface');
					break;
				}
				case 'dock':
				{
					result = result.moveTo('dock');
					break;
				}
				default:
				{
					result = "Invalid action '" + request.params.action + "' for ship.";
					break;
				}
			}

			if (result === true)
			{
				updateShipLocationSummary(ship, game.planets);

				this.writeResponse(response, 200, ship);
			}
			else
			{
				this.writeResponse(response, 400, result);
			}
		}
		else
		{
			// Don't indicate that the id is a valid ship
			this.writeResponse(response, 404, "Ship " + request.params.id + " does not exist.");
		}
	}
}
