const debug = require('debug')('player');
const Backbone = require('backbone');
const _ = require('underscore');
const shortid = require('shortid');

module.exports = class Player extends Backbone.Model {
	constructor(options, brain)
	{
		super();

		this.set({
			id: shortid.generate()
		});

		this.set(options);

		debug("Player created", this.id);
	}
}
