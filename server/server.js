const debug = require('debug')('game-server');
const _ = require('underscore');
const shortid = require('shortid');
const Player = require('./data/player');
const Planets = require('./data/planets');
const Ships = require('./data/ships');
const Blueprints = require('./data/blueprints');

/**
 * Game server
 */
class Server
{
	constructor(options)
	{
		options = _.extend({
			size: 8,
			opponent: null
		}, options);

		// In single player games, the opponent dictates the number of planets
		switch (options.opponent)
		{
			case 'wotok':
			{
				options.size = 8;
				break;
			}
			case 'smine':
			{
				options.size = 16;
				break;
			}
			case 'krart':
			case 'rorn':
			{
				options.size = 32;
				break;
			}
		}

		// Collection of planets
		this._planets = new Planets();
		// Collection of ships
		this._ships = new Ships();
		// Collection of blueprints (shared across all players)
		this._blueprints = new Blueprints();

		// Initialize planets
		this._planets.set(_.map(_.range(options.size), function(index) { return {}; }));

		return true;
	}

	addAI(name)
	{
		var brain;
		switch (name)
		{
			case 'wotok':
			case 'smine':
			case 'krart':
			case 'rorn':
			{
				brain = {};
				break;
			}
			default:
			{
				// Invalid single player opponent
				break;
			}
		}

		if (brain)
		{
			var ai = new Player();
			this.join(ai, 'EnemyBase');
		}

		return !!brain;
	}

	join(player, homebaseName)
	{
		homebaseName = homebaseName || 'Starbase';

		var result = false;
		// Join first player (host)
		if (this.players.length === 0)
		{
			this.planets.first().terraform(player, homebaseName, true);
			this.players.add(player);
			result = true;
			debug("Player", player.id, "joined game", this.id);
		}
		else if (this.players.length === 1)
		{
			this.planets.last().terraform(player, homebaseName, true);
			this.players.add(player);
			result = true;
			debug("Player", player.id, "joined game", this.id);
		}
		else
		{
			result = false;
		}

		return result;
	}
	
	get players()
	{
		return this._players;
	}

	get planets()
	{
		return this._planets;
	}

	get ships()
	{
		return this._ships;
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

	start()
	{
		this.running = true;
		this.tick();
	}

	end()
	{
	}

	tick()
	{
		var delta = this.lastTick - _.now();
		this.lastTick = _.now();

		var date = this.get('date');
		++date.day;
		if (date.day === 65)
		{
			++date.year;
			date.day = 1;
		}

		this.set('date', date);

		// update all plants
		// _.each(this.planets, (planet) => {
		// 	planet.update(this._date, delta);
		// });

		// update all ships
		// _.each(this.ships, (ship) => {
		// 	ship.update(this._date, delta);
		// });

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
