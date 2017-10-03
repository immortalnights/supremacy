const debug = require('debug')('controller');
const _ = require('underscore');
const Player = require('./data/player');
const Server = require('./server');

/**
 * System controller
 * Manages list of game servers
 */
class Controller
{
	constructor()
	{
		this._servers = {}
	}

	get servers()
	{
		return this._servers;
	}

	create(options)
	{
		const isValidType = function(type) {
			return type === 'singleplayer'; // || type === 'multiplayer';
		};

		var server;
		console.log("Attempting to creating server", options);

		if (!_.isString(options.name) || _.isEmpty(options.name))
		{
			console.log("Invalid name");
			throw new Error("Invalid game name '" + options.name + "'");
		}
		else if (!options.type || !isValidType(options.type))
		{
			console.log("Invalid type");
			throw new Error("Invalid game type '" + options.type + "'");
		}
		else
		{
			// create a new server give the options
			server = new Server(options);
			this._servers[server.id] = server;
			debug("Server created", server.id);
		}

		return server;
	}

	createAIPlayer(name)
	{
		var player;
		var brain;
		var systemSize;
		switch (name)
		{
			case 'wotok':
			{
				brain = {};
				systemSize = 8;
				break;
			}
			case 'smine':
			{
				brain = {};
				systemSize = 16;
				break;
			}
			case 'krart':
			{
				brain = {};
				systemSize = 32;
				break;
			}
			case 'rorn':
			{
				brain = {};
				systemSize = 32;
				break;
			}
			default:
			{
				// Invalid single player opponent
				throw new Error("Invalid AI");
				break;
			}
		}

		if (brain)
		{
			player = new Player({
				name: name,
				systemSize: systemSize,
				ai: true,
				homebase: 'EnemyBase'
			}, brain);
		}

		return player;
	}

	remove(id)
	{
		unset(this._servers[id]);
	}
}

var instance = new Controller();
module.exports = function() {
	return instance;
};
