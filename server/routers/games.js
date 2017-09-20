const debug = require('debug')('server');
const Core = require('./core');
const Game = require('../data/game');
const Player = require('../data/player');
const _ = require('underscore');

module.exports = class Controller extends Core {
	constructor(games)
	{
		super();
		this.collection = games;
	}

	bind(router)
	{
		router.get('/games', _.bind(_.partial(this.onGetList, this.collection, _, _, false), this));
		router.get('/games/:id', _.bind(_.partial(this.onGetSingle, this.collection, _, _, false), this));
		router.get('/games/:id/Join/Invoke', _.bind(this.onJoinGame, this));
		router.post('/games', _.bind(this.onCreate, this));
	}

	onCreate(request, response)
	{
		const isValidType = function(type) {
			return type === 'singleplayer'; // || type === 'multiplayer';
		};

		var data = request.body
		if (!_.isString(data.name) || _.isEmpty(data.name))
		{
			console.log("Invalid name");
			this.writeResponse(response, 400, "Invalid game name '" + data.name + "'");
		}
		else if (!data.type || !isValidType(data.type))
		{
			console.log("Invalid type");
			this.writeResponse(response, 400, "Invalid game type '" + data.type + "'");
		}
		else
		{
			console.log("Create game", request.body);

			// Create the game
			var game = new Game(_.pick(data, 'name', 'type'));

			// Setup
			if (!game || !game.setup(_.pick(data, 'size', 'opponent')))
			{
				console.log("Failed setup");
				this.writeResponse(400, "Failed to setup game");
			}
			// Add AI (single player)
			else if (data.type === 'singleplayer' && !game.addAI(data.opponent))
			{
				console.log("Failed to add AI");
				this.writeResponse(response, 400, {
					message: "Invalid AI opponent '" + data.opponent + "'"
				});
			}
			else
			{
				// Automatically join the game
				var player = new Player();
				if (game.join(player))
				{
					this.collection.add(game);

					// Begin successful response
					response.setHeader('Set-Cookie', ["gameId=" + game.id + "; path=/", "playerId=" + player.id + "; path=/"]);
					this.writeResponse(response, 201, game);
				}
				else
				{
					console.log("Failed to add player");
					this.writeResponse(response, 400, "Failed to join created game");
				}
			}
		}
	}

	onJoinGame(request, response)
	{
		var game = this.filter(this.collection, { id: request.params.id })[0];

		if (game)
		{
			var playerId = this.getPlayerId(request);
			var player = game.players.get(playerId);

			if (player)
			{
				this.writeResponse(response, 200, game);
			}
			else
			{
				// Create a new player and join the game
				var player = new Player();

				if (game.join(player))
				{
					response.setHeader('Set-Cookie', ["gameId=" + game.id + "; path=/", "playerId=" + player.id + "; path=/"]);
					this.writeResponse(response, 200, game);
				}
				else
				{
					this.writeResponse(response, 400, "Failed to join game '" + request.params.id + "'");
				}
			}
		}
		else
		{
			this.writeResponse(response, 404, "Game '" + request.params.id + "' not found");
		}
	}
}
