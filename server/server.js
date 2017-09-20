const debug = require('debug')('server');
const http = require('http');
const Router = require('node-simple-router');
const _ = require('underscore');
const Game = require('./game');

var game = new Game();
game.populate(8);
game.start();

var router = Router();

const filter = function(collection, attr) {
	const property = function(obj, key) {
		// debug("check", key, obj);
		return key.split('.').reduce(function(o, i) {
			// debug("o", o, "i", i, "o[i]", o[i])
			return o[i];
		}, obj);
	}

	debug("Filter", collection.length, "by", attr);
	return collection.filter(function(item) {
		// debug("Filter", item.attributes, attr);
		return _.isEmpty(attr) || _.every(item.attributes, function(value, key) {
			var attribute = property(item.attributes, key);
			debug("check value", attribute, value);
			return !_.isUndefined(attribute) && attribute == value;
		});
	});
}

class GameController
{
	constructor(router, game)
	{
		router.get('/game/:id', (request, response) => {
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ date: game.date }));
		});
	}
}

class PlanetController
{
	constructor(router, game)
	{
		router.get('/planets', function(request, response) {
			var results = filter(game.planets, request.get);

			results = _.map(results, function(planet) {
				if (planet.owner === game.getPlayer())
				{
					return planet.toJSON();
				}
				else
				{
					return planet.pick('id', 'name');
				}
			});

			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify(results));
		});

		router.get('/planets/:id', function(request, response) {
			var result = filter(game.planets, { id: request.params.id })[0];

			if (result)
			{
				// Ensure the player is asking for their own planet
				if (result.owner === game.getPlayer())
				{
					// add the game date to the attributes
					var data = result.toJSON();
					data.date = game.date;

					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify(data));
				}
				else if (result.owner)
				{
					response.writeHead(403, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({
						reason: 'classified',
						message: "You do not have access to view this planet."
					}));
				}
				else
				{
					response.writeHead(403, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({
						reason: 'unoccupied',
						message: "This planet is not occupied."
					}));
				}
			}
			else
			{
				response.writeHead(404, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({
					message: "Planet " + request.params.id + " does not exist."
				}));
			}
		});
	}
}

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

class ShipContoller
{
	constructor(router, game)
	{
		router.get('/ships', function(request, response) {
			var results = filter(game.ships, request.get);

			results = _.filter(results, function(ship) {
				return (ship.owner === game.getPlayer());
			});

			results = _.map(results, function(ship) {
				return ship.attributes;
			});

			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify(results));
		});

		router.get('/ships/:id', function(request, response) {
			var result = filter(game.ships, { id: request.params.id })[0];

			if (result && result.owner === game.getPlayer())
			{
				updateShipLocationSummary(result, game.planets);

				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify(result.attributes));
			}
			else
			{
				// Don't indicate that the id is a valid ship
				response.writeHead(404, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({
					message: "Ship " + request.params.id + " does not exist."
				}));
			}
		});

		router.put('/ships/:id/:action/invoke', function(request, response) {
			var result = filter(game.ships, { id: request.params.id })[0];

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
						response.writeHead(404, { 'Content-Type': 'application/json' });
						response.end(JSON.stringify({
							message: "Invalid action '" + request.params.action + "' for ship."
						}));
						break;
					}
				}

				if (result === true)
				{
					updateShipLocationSummary(ship, game.planets);

					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify(ship.attributes));
				}
				else
				{
					response.writeHead(400, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify({
						message: result
					}));
				}
			}
			else
			{
				// Don't indicate that the id is a valid ship
				response.writeHead(404, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({
					message: "Ship " + request.params.id + " does not exist."
				}));
			}
		});
	}
}

class ShopContoller
{
	constructor(router, game)
	{
		this.blueprints = game.blueprints;

		router.get('/blueprints', (request, response) => {
			var result = filter(this.blueprints, request.get);

			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify(result));
		});

		router.post('/blueprints/:id/build/invoke', (request, response) => {
			var result = filter(this.blueprints, { id: request.params.id })[0];

			if (result)
			{
				var ship = game.buildShip(result, game.getPlayer());

				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify(ship.attributes));
			}
			else
			{
				response.writeHead(404, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({
					message: "Blueprint " + request.params.id + " does not exist."
				}));
			}
		});
	}
}

new GameController(router, game);
new PlanetController(router, game);
new ShipContoller(router, game);
new ShopContoller(router, game);


// router(function(req, res, next) {
// 	// Catch all;
// 	res.send('404');
// });

// router(function(err, req, res, next) {
// 	res.send(err);
// });

http.createServer(router).listen(2000, '127.0.0.1');

debug("Server running at http://127.0.0.1:2000/");
