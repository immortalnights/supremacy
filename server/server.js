const debug = require('debug')('game-server');
const _ = require('underscore');
const Backbone = require('backbone');
const shortid = require('shortid');
const Random = require('random-seed');
const Game = require('./data/game');
const Blueprints = require('./data/blueprints');
const Ship = require('./data/ship');

/**
 * Game server
 */
class Server
{
	constructor(options)
	{
		this.running = false;
		this.speedMultiplier = 1;
		this.speed = 3600;
		this.lastTick = 0;

		this.generator = new Random('seed');
		// TODO generator.done() when server closes
		this._game = new Game(options.name, options.type, this.generator);

		this._players = new Backbone.Collection();
		// Collection of blueprints (shared across all players)
		this._blueprints = new Blueprints();
	}

	get id()
	{
		return this._game.id;
	}

	get game()
	{
		return this._game;
	}

	get players()
	{
		return this._players;
	}

	get blueprints()
	{
		return this._blueprints;
	}

	join(player)
	{
		var result = false;
		if (this.players.length >= 2)
		{
			throw new Error("Unable to join game. Game is full");
		}
		else
		{
			this.players.add(player);
			debug("Player", player.id, "joined game", this.id);
			result = true;

			if (this.players.length === 2)
			{
				this.game.set('status', 'eWAITING_FOR_HOST');
			}
		}

		return result;
	}

	leave()
	{
		// TODO
	}

	start()
	{
		console.assert(this.players.length === 2);

		// Host is always on the last planet (bottom)
		var player1 = this.players.first();
		this.game.planets.last().terraform(player1, player1.get('homebase'), true, this.generator);
		var player2 = this.players.last();
		this.game.planets.first().terraform(player2, player2.get('homebase'), true, this.generator);

		this.running = true;
		this.game.set('status', 'eRUNNING');
		this.tick();
	}

	buildShip(blueprint, playerId)
	{
		console.log("Attempting to build", blueprint.get('name'));
		let ship;

		// 
		const canBuild = function(blueprint, player, ships) {
			let result = true;
			if ('atmos' === blueprint.get('type'))
			{
				// Can only have one atmos
				if (!ships.some(function(ship) {
					return ship.owner.id === player.id && ship.get('type') === atmos;
				}))
				{
					// Player already has an atmos
				}
			}
			return result;
		};

		const canAfford = function(blueprint, planet) {
			return true;
		};

		var player = this.players.get(playerId);
		if (!player)
		{
			throw new Error("Invalid player");
		}
		else
		{
			var planet = this.game.planets.find(function(planet) {
				var found = false;
				if (planet.owner && planet.owner.id === player.id)
				{
					if (planet.get('primary'))
					{
						found = true;
					}
				}

				return found;
			});

			if (!planet)
			{
				throw new Error("Failed to find primary planet for player");
			}
			else if (!canBuild(blueprint, player))
			{
				throw new Error("Cannot build ship");
			}
			else if (!canAfford(blueprint, planet))
			{
				throw new Error("Cannot afford ship");
			}
			else
			{
				ship = new Ship(_.clone(blueprint));
				ship.owner = player;

				ship.set('location', {
					planet: planet.id,
					position: 'dock'
				});

				this.game.ships.push(ship);
			}
		}

		return ship;
	}

	end()
	{
	}

	tick()
	{
		var delta = this.lastTick - _.now();
		this.lastTick = _.now();

		// Default 5s per day
		var tickDelay = this.speed / this.speedMultiplier;
		this.ticker = _.delay(_.bind(function() {
			var delta = _.now() - this.lastTick;
			this.lastTick = _.now();

			if (this.running)
			{
				console.log("Tick", delta);
				this.game.tick(delta);
				this.tick();
			}
		}, this), tickDelay);
	}
}

module.exports = Server;
