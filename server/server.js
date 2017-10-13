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

		let difficulty = 'easy';
		const build = function(blueprint, planet) {
			let result;
			let cost = blueprint.get('cost');

			let credits = planet.get('credits');
			let energy = planet.get('energy');
			let materials = planet.get('materials');

			console.log(cost, ":", credits, energy, materials)

			switch (difficulty)
			{
				case 'easy':
				{
					if (cost.credits <= credits)
					{
						planet.set('credits', credits - cost.credits);
						result = true;
					}
					break;
				}
				case 'medium':
				{
					if (cost.credits <= credits && cost.energy <= energy)
					{
						planet.set('credits', credits - cost.credits);
						planet.set('energy', energy - cost.energy);
						result = true;
					}
					break;
				}
				case 'hard':
				{
					if (cost.credits <= credits && cost.energy <= energy && cost.materials <= materials)
					{
						planet.set('credits', credits - cost.credits);
						planet.set('energy', energy - cost.energy);
						planet.set('materials', materials - cost.materials);
						result = true;
					}
					break;
				}
				case 'extreme':
				{
					if (cost.credits <= credits && cost.energy <= energy && cost.materials <= materials)
					{
						planet.set('credits', credits - cost.credits);
						planet.set('energy', energy - cost.energy);
						planet.set('materials', materials - cost.materials);
						result = true;
					}
					break;
				}
			}

			return result;
		};

		let player = this.players.get(playerId);
		if (!player)
		{
			throw new Error("Invalid player");
		}
		else
		{
			let planet = this.game.planets.find(function(planet) {
				let found = false;
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
			else if (!build(blueprint, planet))
			{
				throw new Error("Cannot afford ship");
			}
			else
			{
				var attr = blueprint.omit('id', 'name', 'shortName', 'desc', 'cost');
				console.log(attr);

				ship = new Ship(attr);

				ship.owner = player;
				ship.set('name', blueprint.get('shortName'));
				ship.set('value', blueprint.get('cost').credits);
				ship.set('location', {
					planet: planet.id,
					position: 'dock'
				});

				console.log(ship.attributes);

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
