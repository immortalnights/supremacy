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
		var gameId = Cookies.get('gameId');
console.log("cookie", Cookies.get());
		if (gameId)
		{
			result = new Game({
				id: gameId
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

	}

	return Game;
});
