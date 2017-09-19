const debug = require('debug')('planet');
const Backbone = require('backbone');
const Planet = require('./planet');

module.exports = class Planets  extends Backbone.Collection {
	constructor()
	{
		super()
		this.model = Planet;
	}
};