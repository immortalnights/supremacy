define(['backbone',
       'cookies'],
       function(Backbone,
                Cookies) {
	'use strict';

	var Game = Backbone.Model.extend({
		urlRoot: 'app/games',

		initialize: function(attributes, options)
		{
			Backbone.Model.prototype.initialize.call(this, attributes, options);
		}
	});

	Game.resume = function() {
		var result;
		var serverId = Cookies.get('serverId');

		if (serverId)
		{
			result = new Game({
				id: serverId
			});
		}

		return result;
	}

	Game.host = function(options) {
		var game = new Game({
			name: "My Game",
			type: options.type,
			opponent: options.opponent
		});

		return game.save();
	}

	Game.join = function(options) {
		var game = new Game({
			id: options.id
		});

		return game.fetch();
	}

	return Game;
});
