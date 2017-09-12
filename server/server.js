const debug = require('debug')('server');
const http = require('http');
const Router = require('node-simple-router');
const _ = require('underscore');
const Game = require('./game');

var game = new Game();
game.populate(8);
game.start();

var router = Router();

const filter = function(list, attributes) {
	const property = function(obj, key) {
		// debug("check", key, obj);
		return key.split('.').reduce(function(o, i) {
			return o[i];
		}, obj);
	}

	return _.filter(list, function(item) {
		// debug("Filter", item, attributes);
		return _.every(attributes, function(value, key) {
			var attribute = property(item, key);
			// debug("check value", attribute, value);
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
		this.planets = game.planets;

		router.get('/planets', (request, response) => {
			var results = filter(this.planets, request.get);

			results = _.map(results, function(planet) {
				if (planet.owner === game.getPlayer())
				{
					return planet.attributes;
				}
				else
				{
					return _.pick(planet.attributes, 'id', 'name');
				}
			});

			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify(results));
		});

		router.get('/planets/:id', (request, response) => {
			var result = filter(this.planets, { id: request.params.id })[0];

			if (result)
			{
				// Ensure the player is asking for their own planet
				if (result.owner === game.getPlayer())
				{
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify(result.attributes));
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

class ShipContoller
{
	constructor(router, game)
	{
		this.ships = game.ships;

		router.get('/ships', (request, response) => {
			var results = filter(this.ships, request.get);

			results = _.filter(results, function(ship) {
				return (ship.owner === game.getPlayer());
			});

			results = _.map(results, function(ship) {
				return ship.attributes;
			});

			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify(results));
		});

		router.get('/ships/:id', (request, response) => {
			var result = filter(this.ships, { id: request.params.id })[0];

			if (result && result.owner === game.getPlayer())
			{
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

		router.put('/ships/:id/launch/invoke', (request, response) => {
			var result = filter(this.ships, { id: request.params.id })[0];

			if (result && result.owner === game.getPlayer())
			{
				result.move('orbit')
				.then(function() {
						response.writeHead(200, { 'Content-Type': 'application/json' });
						response.end(JSON.stringify(result.attributes));
				}, function(err) {
						response.writeHead(400, { 'Content-Type': 'text/plain' });
						response.end(err);
				});
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

		router.put('/ships/:id/land/invoke', (request, response) => {
			var result = filter(this.ships, { id: request.params.id })[0];

			if (result && result.owner === game.getPlayer())
			{
				result.move('surface')
				.then(function() {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.end(JSON.stringify(result.attributes));
				})
				.catch(function(err) {
					response.writeHead(400, { 'Content-Type': 'text/plain' });
					response.end(err);
				});
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

		router.put('/ships/:id/dock/invoke', (request, response) => {
			var result = filter(this.ships, { id: request.params.id })[0];

			if (result && result.owner === game.getPlayer())
			{
				result.move('dock')
				.then(function() {
						response.writeHead(200, { 'Content-Type': 'application/json' });
						response.end(JSON.stringify(result.attributes));
				}, function(err) {
						response.writeHead(400, { 'Content-Type': 'text/plain' });
						response.end(err);
				});
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
