const debug = require('debug')('server');
const _ = require('underscore');
const Backbone = require('backbone');

module.exports = class Core {
	constructor()
	{
	}

	bind(router)
	{
		// router(function(req, res, next) {
		// 	// Catch all;
		// 	res.send('404');
		// });

		// router(function(err, req, res, next) {
		// 	res.send(err);
		// });
	}

	getGameId(request)
	{
		var id;
		var cookies = request.headers['cookie'] || '';
		var match = cookies.match(/gameId=([\w-]+)/);
		if (match)
		{
			id = match[1];
		}
		return id;
	}

	getPlayerId(request)
	{
		var id;
		var cookies = request.headers['cookie'] || '';
		var match = cookies.match(/playerId=([\w-]+)/);
		if (match)
		{
			id = match[1];
		}
		return id;
	}

	findGame(request, response)
	{
		var gameId = this.getGameId(request);
		var playerId = this.getPlayerId(request);

		var game = this.collection.get(gameId);
		if (!game)
		{
			this.writeResponse(response, 404, "Failed to find game '" + gameId + "'");
		}
		else if (!game.players.get(playerId))
		{
			this.writeResponse(response, 404, "Failed to find player '" + playerId + "' in game '" + gameId + "'");
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
