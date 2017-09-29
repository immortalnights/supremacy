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
		// router(function(req, res, next) {
		// 	// Catch all;
		// 	res.send('404');
		// });

		// router(function(err, req, res, next) {
		// 	res.send(err);
		// });
	}

	get controller()
	{
		return controller();
	}

	parseCookies(request)
	{
		var result = {};

		var regex = /([\w]+)=([\{\w-\}]+);?/g;
		var cookie;
		do
		{
			cookie = regex.exec(request.headers['cookie']);
			result[cookie[1]] = cookie[2];
		} while (cookie);

		return result;
	}

	getPlayerGame(request, response)
	{
		var cookies = this.parseCookies(request);
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
				else
				{
					rawData = JSON.stringify(data);
				}
			}

			response.end(rawData);
		}
	}
}
