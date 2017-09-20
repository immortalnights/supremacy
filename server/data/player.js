const debug = require('debug')('player');
const Backbone = require('backbone');
const _ = require('underscore');
const shortid = require('shortid');

module.exports = class Player extends Backbone.Model {
	constructor(brain)
	{
		super();

		this.set({
			id: shortid.generate(),
			name: brain ? brain.name : 'human'
		});

		debug("Player created", this.id);
	}
}
