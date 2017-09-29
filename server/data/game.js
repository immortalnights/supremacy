const debug = require('debug')('game');
const Backbone = require('backbone');
const _ = require('underscore');
const shortid = require('shortid');

module.exports = class Game extends Backbone.Model {
	constructor(name, type, seed)
	{
		super();
		this.set({
			id: shortid.generate(),
			name: name,
			type: type,
			date: {
				day: 1,
				year: 2010
			},
			seed: seed || Math.random()
		});

		this._players = new Backbone.Collection();

		this.running = false;
		this.speedMultiplier = 1;
		this.speed = 5000;

		this.lastTick = 0;

		debug("Game created", this.id);
	}


}
