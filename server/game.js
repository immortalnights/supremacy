const debug = require('debug')('game');
const _ = require('underscore');
const Player = require('./data/player');
const Planets = require('./data/planets');
const Blueprints = require('./data/blueprints');
const Ships = require('./data/ships');

class Game
{
	constructor(seed)
	{
		// super();
		this._date = {
			day: 1,
			year: 2010
		};

		this.running = false;
		this.seed = seed;
		this.speedMultiplier = 1;
		this.speed = 5000;

		this._players = [new Player('AI_easy'), new Player(null)];
		this._planets = new Planets();
		this._ships = new Ships();

		// Blueprints are shared across all players
		this._blueprints = new Blueprints();

		this.lastTick = 0;
	}

	populate(size)
	{
		this._planets.set(_.map(_.range(size), function(index) { return {}; }));

		// The Enemy starts at the 1st planet
		this._planets.first().terraform(_.first(this._players), 'EnemyBase', true);

		// The player starts at the last planet
		this._planets.first().terraform(_.last(this._players), 'Starbase', true);
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
		return this._blueprints;
	}

	buildShip(blueprint, player)
	{
		if ('atmos' === blueprint.type)
		{

		}
		else
		{

		}


		var ship = new Ship(_.clone(blueprint));
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
	}

	end()
	{
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
		// _.each(this.planets, (planet) => {
		// 	planet.update(this._date, delta);
		// });

		// update all ships
		// _.each(this.ships, (ship) => {
		// 	ship.update(this._date, delta);
		// });

		// Default 5s per day
		var tickDelay = this.speed * this.speedMultiplier;
		this.ticker = _.delay(_.bind(this.onTick, this), tickDelay);
	}

	onTick()
	{
		var delta = _.now() - this.lastTick;
		this.lastTick = _.now();

		if (this.running)
		{
			this.tick();
		}
	}
}

module.exports = Game;
