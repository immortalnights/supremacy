const debug = require('debug')('player');
const _ = require('underscore');
const EventEmitter = require('events');

class Player extends EventEmitter
{
	constructor(brain)
	{
		super();

		this.id = _.uniqueId();
		this.brain = brain;
		this.name = brain ? brain.name : 'human';
	}

	get isHuman()
	{
		return _.isNull(this.brain);
	}
}

module.exports = Player;
