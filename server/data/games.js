const debug = require('debug')('planet');
const Backbone = require('backbone');
const Game = require('./game');

module.exports = class Games  extends Backbone.Collection {
	constructor(models, options)
	{
		super(models, options)
		this.model = Game;
	}
};
