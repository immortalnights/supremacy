const debug = require('debug')('server');
const controller = require('../controller');
const _ = require('underscore');
const Backbone = require('backbone');

/**
 * Base class for all Routers
 * TODO Handles catchall and error routes
 */
module.exports = class Core {
	constructor(router)
	{
		// Called with request as context
		const parseCookies = function() {
			let result = {};
			const regex = /([\w]+)=([\{\w-\}]+);?/g;

			debug("Parse", this.headers['cookie']);
			let cookie;
			do
			{
				cookie = regex.exec(this.headers['cookie']);
				if (cookie)
				{
					result[cookie[1]] = cookie[2];
				}
			} while (cookie);

			return result;
		}

		// Wrap each registered path / callback to parse cookies and lookup server
		const wrapper = function(callback, restricted) {
			return (request, response) => {
				request.cookies = parseCookies.call(request);

				console.log("SESSION", request.nsr_session);

				let server;
				if (request.cookies.serverId)
				{
					server = this.controller.servers[request.cookies.serverId];

					if (server && !_.find(server.players, function(player) {
						return player.id === request.cookies.playerId
					}))
					{
						// Invalid player id
						server = null;
					}
				}

				// Restricted paths are only available if the user is in a valid game
				if (server || restricted === false)
				{
					callback.call(this, request, response, server);
				}
				else
				{
					this.writeResponse(response, '403', "Access Denied");
				}
			}
		};

		let self = this;
		// Define object to allow URL path registrations with wrapper
		this.register = {
			get: function(path, callback, restricted) {
				debug("Register", path);
				router.get(path, wrapper.call(self, callback, restricted));
			},
			put: function(path, callback, restricted) {
				debug("Register", path);
				router.put(path, wrapper.call(self, callback, restricted));
			},
			post: function(path, callback, restricted) {
				debug("Register", path);
				router.post(path, wrapper.call(self, callback, restricted));
			}
		}
	}

	get controller()
	{
		return controller();
	}

	getPlayerGame(request, response)
	{
		var game = this.controller.games[cookies.gameId];

		if (!game && response)
		{
			this.writeResponse(response, 404, "Failed to find game '" + cookies.gameId + "'");
		}
		else
		{
			var player = game.players.get(cookies.playerId);
			if (!player && response)
			{
				this.writeResponse(response, 404, "Failed to find player '" + cookies.playerId + "' in game '" + cookies.gameId + "'");
			}
		}

		return game;
	}

	// TODO may be better as part of Collection
	filter(collection, attr)
	{
		const property = function(obj, key) {
			// debug("property", key, obj);
			return key.split('.').reduce(function(o, i) {
				// debug("o", o, "i", i, "o[i]", o[i])
				return o[i];
			}, obj);
		}

		// debug("Filter", collection.length, "by", attr);
		return _.isEmpty(attr) ? collection.models : collection.filter(function(item) {
			// debug("Filter against", item.attributes);
			return _.every(attr, function(value, key) {
				var attribute = property(item.attributes, key);
				// debug("check value", attribute, value);
				return attribute == value;
			});
		});
	}

	onGetList(collection, request, response, checkPermissions)
	{
		this.parseCookies(request);
		return;
		var results = this.filter(collection, request.get);
		const playerId = this.getPlayerId(request);

		if (checkPermissions === false)
		{
			results = _.filter(results, function(item) {
				return !item.owner || (item.owner.id === playerId);
			});
		}

		results = _.map(results, function(item) {
			return item.toJSON();
		});

		this.writeResponse(response, 200, results);
	}

	onGetSingle(collection, request, response, checkPermissions)
	{
		var item = this.filter(collection, { id: request.params.id })[0];

		if (item)
		{
			const playerId = this.getPlayerId(request);
			if (checkPermissions === false || !item.owner || (playerId && item.owner === playerId))
			{
				this.writeResponse(response, 200, item);
			}
			else
			{
				this.writeResponse(response, 403);
			}
		}
		else
		{
			this.writeResponse(response, 404, {
				message: "Resource '" + request.params.id + "' does not exist."
			});
		}
	}

	writeResponse(response, status, data)
	{
		var headers = {}

		if (data)
		{
			headers['Content-Type'] = 'application/json';
		}

		response.writeHead(status, headers);

		if (data)
		{
			var rawData;
			if (_.isString(data))
			{
				rawData = JSON.stringify({
					message: data
				});
			}
			else if (_.isObject(data))
			{
				if (data instanceof Backbone.Collection || data instanceof Backbone.Model)
				{
					rawData = JSON.stringify(data.toJSON());
				}
				else if (data instanceof Error)
				{
					rawData = JSON.stringify({
						message: data.message,
						stack: data.stack
					});
				}
				else
				{
					rawData = JSON.stringify(data);
				}
			}

			// console.log("responseData", rawData);
			response.end(rawData);
		}
	}
}
