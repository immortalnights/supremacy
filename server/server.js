const debug = require('debug')('game-server');
const _ = require('underscore');
const shortid = require('shortid');
const Game = require('./data/game');
const Blueprints = require('./data/blueprints');

/**
 * Game server
 */
class Server
{
	constructor(options)
	{
		this.running = false;
		this.speedMultiplier = 1;
		this.speed = 5000;
		this.lastTick = 0;

		this._game = new Game(options.name, options.type, options.seed);

		this._players = [];
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

	join(player)
	{
		var result = false;
		if (this.players.length >= 2)
		{
			throw new Error("Unable to join game. Game is full");
		}
		else
		{
			this.players.push(player);
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
		var player1 = this.players[0];
		this.game.planets.last().terraform(player1, player1.get('homebase'), true);
		var player2 = this.players[1];
		this.game.planets.first().terraform(player2, player2.get('homebase'), true);

		this.running = true;
		this.game.set('status', 'eRUNNING');
		this.tick();
	}

	get players()
	{
		return this._players;
	}

	get blueprints()
	{
		return this._blueprints;
	}

	buildShip(blueprint, playerId)
	{
		var result;

		// 
		const canBuild = function(blueprint, player, ships) {
			var result = true;
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
			result = "Failed to find player '" + playerId + "'";
		}
		else
		{
			var planet = this.planets.find(function(planet) {
				var found = false;
				if (planet.owner && planet.owner.id === player.id)
				{
					if (planet.get('primary'))
					{
						found = true;
					}
				}
			});

			if (!planet)
			{
				result = "Failed to find primary planet for player '" + player.id + "'";
			}
			else if (!canBuild(blueprint, player))
			{
				result = "Cannot build another '" + blueprint.get('name') + "'";
			}
			else if (!canAfford(blueprint, planet))
			{
				result = "Cannot afford '" + blueprint.get('name') + "'";
			}
			else
			{
				var ship = new Ship(_.clone(blueprint));
				ship.owner = player;

				ship.set('location', {
					planet: planet.id,
					position: 'dock'
				});

				this.ships.push(ship);

				result = ship;
			}
		}

		return result;
	}

	end()
	{
	}

	tick()
	{
		var delta = this.lastTick - _.now();
		this.lastTick = _.now();

		// Default 5s per day
		var tickDelay = this.speed * this.speedMultiplier;
		this.ticker = _.delay(_.bind(function() {
			var delta = _.now() - this.lastTick;
			this.lastTick = _.now();

			if (this.running)
			{
				this.tick();
			}
		}, this), tickDelay);
	}
}

module.exports = Server;
