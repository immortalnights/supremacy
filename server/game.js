const debug = require('debug')('game');
const _ = require('underscore');
const EventEmitter = require('events');
const Player = require('./player');
const Planet = require('./planet');
const Blueprints = require('./blueprints');
const Ship = require('./ship');

class Game extends EventEmitter
{
	constructor(seed)
	{
		super();
		this.running = false;
		this.seed = seed;

		this._players = [new Player('AI_easy'), new Player(null)];
		this._planets = [];
		this._ships = [];

		// Blueprints are shared across all players
		this._blueprints = new Blueprints();

		this.lastTick = 0;
	}

	populate(size)
	{
		var self = this;
		this._planets = _.map(_.range(size), function(index) {
			var planet = new Planet({
				id: index
			});

			// Update planets on the 'update' event
			// this.on('update', _.bind(planet, planet.update));
			self.on('update', _.bind(planet.update, planet));

			return planet;
		});

		// The Enemy starts at the 1st planet
		_.first(this._planets).terraform(_.first(this._players), {
			name: 'EnemyBase',
			primary: true
		});

		// The player starts at the last planet
		_.last(this._planets).terraform(_.last(this._players), {
			name: 'Starbase',
			primary: true
		});
	}

	getPlayer()
	{
		return _.find(this._players, function(p) {
			return p.isHuman;
		});
	}

	// automatically filtered for the human player
	get planets()
	{
		return this._planets;
		// var result = [];

		// var player = this.getPlayer();

		// debug("player", player);

		// _.each(this._planets, function(planet) {
		// 	debug("Check", planet.owner, planet.id);
		// 	if (planet.owner === player)
		// 	{
		// 		debug("Planet owned", planet.id);
		// 		result.push(planet.attributes);
		// 	}
		// 	else if (planet.owner)
		// 	{
		// 		debug("Planet classified", planet.id);
		// 		var info = _.pick(planet, 'id');
		// 		info.name = 'Classified';
		// 		result.push(info);
		// 	}
		// 	else
		// 	{
		// 		debug("Planet unidentified", planet.id);
		// 		result.push(_.pick(planet, 'id', 'name'));
		// 	}
		// });

		// return result;
	}

	// automatically filtered for the human player
	get ships()
	{
		return this._ships;
		// var result = [];

		// var player = this.getPlayer();

		// debug("player", player);

		// _.each(this._ships, function(ship) {
		// 	if (ship.owner === player)
		// 	{
		// 		result.push(ship.attributes);
		// 	}
		// });

		// return result;
	}

	get blueprints()
	{
		return this._blueprints.available;
	}

	buildShip(blueprint, player)
	{
		console.log(blueprint);
		var ship = new Ship(_.clone(blueprint));
		console.log(ship);
		// Assign a new Id
		// TODO assign new name
		ship.id = this._ships.length;

		if (ship)
		{
			var planet = _.findWhere(this._planets, { name: 'Starbase' });

			ship.owner = this.getPlayer();
			ship.location = {
				planet: planet.id,
				position: 'dock'
			};

			this._ships.push(ship);
		}

		return ship;
	}

	start()
	{
		this.running = true;
		this.tick();
		this.emit('start');
	}

	end()
	{
		this.emit('end');
		this.removeAllListeners();
	}

	tick()
	{
		this.lastTick = _.now();
		this.ticker = _.delay(_.bind(this.onTick, this), 1000);
	}

	onTick()
	{
		var delta = _.now() - this.lastTick;
		this.lastTick = _.now();

		// debug("Update", delta);
		this.emit('update', delta);

		if (this.running)
		{
			this.tick();
		}
	}
}

module.exports = Game;
