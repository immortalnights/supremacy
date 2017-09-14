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
		this._date = {
			day: 1,
			year: 2010
		};

		this.running = false;
		this.seed = seed;
		this.speedMultiplier = 1;
		this.speed = 5000;

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

	get date()
	{
		return this._date;
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
		var delta = this.lastTick - _.now();
		this.lastTick = _.now();

		++this._date.day;
		if (this._date.day === 65)
		{
			++this._date.year;
			this._date.day = 1;
		}

		// update all plants
		_.each(this.planets, (planet) => {
			planet.update(this._date, delta);
		});

		// update all ships
		_.each(this.ships, (ship) => {
			ship.update(this._date, delta);
		});

		// Default 5s per day
		var tickDelay = this.speed * this.speedMultiplier;
		this.ticker = _.delay(_.bind(this.onTick, this), tickDelay);
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
