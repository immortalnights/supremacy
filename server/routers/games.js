const debug = require('debug')('server');
const Core = require('./core');
const Game = require('../data/game');
const Player = require('../data/player');
const _ = require('underscore');

/**
 * Handles Games related API routes
 */
module.exports = class Controller extends Core {
	constructor(router)
	{
		super(router);

		this.register.get('/games',                 this.onGetGames, false);
		this.register.get('/games/:id',             this.onGetGame, false);
		this.register.get('/games/:id/Join/Invoke', this.onJoinGame, false);
		this.register.post('/games',                this.onCreate, false);
	}

	onGetGames(request, response)
	{
		var servers = this.controller.servers;
		var result = _.map(servers, function(server, key) {
			return server.game;
		});

		this.writeResponse(response, 200, result);
	}

	onGetGame(request, response)
	{
		var server = this.controller.servers[request.params.id];

		if (server)
		{
			this.writeResponse(response, 200, server.game);
		}
		else
		{
			this.writeResponse(response, 404, "Failed to find game '" + request.params.id + "'");
		}
	}

	onCreate(request, response, server)
	{
		// TODO fail if server

		var data = request.body;
		try
		{
			var server = this.controller.create(data);

			var player = new Player({
				name: 'host',
				homebase: 'StarBase'
			});
			server.join(player);

			if (data.type === 'singleplayer')
			{
				// server.setDifficulty('easy');

				// Join AI player
				var ai = this.controller.createAIPlayer(data.opponent);
				server.join(ai);

				var options = {
					size: ai.get('systemSize')
				};

				// Automatically set up the game
				server.game.setup(options);
				// Automatically start the game
				server.start();
			}

			// Begin successful response
			response.setHeader('Set-Cookie', ["serverId=" + server.id + "; path=/", "playerId=" + player.id + "; path=/"]);
			this.writeResponse(response, 201, server.game);
		}
		catch (err)
		{
			console.log("***", err);
			this.writeResponse(response, 400, err);
		}
	}

	onJoinGame(request, response)
	{
		var server = this.findServer(request.params.id)[0];

		if (server)
		{
			var playerId = request.cookies.playerId;
			var player = server.game.players.get(playerId);

			if (player)
			{
				this.writeResponse(response, 200, server.game);
			}
			else
			{
				// Create a new player and join the game
				var player = new Player();

				if (sever.join(player))
				{
					response.setHeader('Set-Cookie', ["serverId=" + server.id + "; path=/", "playerId=" + player.id + "; path=/"]);
					this.writeResponse(response, 200, server.game);
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
