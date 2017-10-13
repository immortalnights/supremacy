const debug = require('debug')('ship');
const Backbone = require('backbone');
const Ship = require('./ship');

module.exports = class Ships  extends Backbone.Collection {
	constructor(models, options)
	{
		super(models, options)
		this.model = Ship;
	}
};
