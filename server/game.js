const debug = require('debug')('game');
const _ = require('underscore');
const EventEmitter = require('events');
const Player = require('./player');
const Planet = require('./planet');

class Game extends EventEmitter
{
	constructor(seed)
	{
		super();
		this.running = false;
		this.seed = seed;
		this._planets = [];

		this._players = [new Player('AI_easy'), new Player(null)];

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
		_.first(this._planets).terraform(_.first(this._players), 'EnemyBase');

		// The player starts at the last planet
		_.last(this._planets).terraform(_.last(this._players), 'Starbase');
	}

	// automatically filtered for the human player
	get planets()
	{
		var result = [];

		var player = _.find(this._players, function(p) {
			return p.isHuman;
		});

		debug("player", player);

		_.each(this._planets, function(planet) {
			debug("Check", planet.owner, planet.id);
			if (planet.owner === player)
			{
				debug("Planet owned", planet.id);
				result.push(planet.attributes);
			}
			else if (planet.owner)
			{
				debug("Planet classified", planet.id);
				var info = _.pick(planet, 'id');
				info.name = 'Classified';
				result.push(info);
			}
			else
			{
				debug("Planet unidentified", planet.id);
				result.push(_.pick(planet, 'id', 'name'));
			}
		});

		return result;
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

		debug("Update", delta);
		this.emit('update', delta);

		if (this.running)
		{
			this.tick();
		}
	}
}

module.exports = Game;
