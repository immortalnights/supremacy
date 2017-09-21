define(['backbone.marionette',
       'routers/index',
       'data/game',
       'cookies'],
       function(Marionette,
                Router,
                Game,
                Cookies) {
	'use strict';

	var RootLayout = Marionette.View.extend({
		el: 'body',
		template: false,

		regions: {
			main: 'main'
		},

		onRender: function()
		{
		}
	})

	var Application = Marionette.Application.extend({
		initialize: function(options)
		{
			Marionette.Application.prototype.initialize.call(this, options);
			console.log("Application initialized");
			new Router();

			// Reduce the global request timeout
			Backbone.$.ajaxSetup({
				timeout: 5000
			});
		},

		getGame: function()
		{
			return this.game;
		},

		onStart: function()
		{
			console.log("Started...");
			this.rootLayout = new RootLayout();

			var game = Game.resume();

			if (game)
			{
				// Don't want too long for the game to load 'cause it blocks the user
				game.fetch()
				.then(_.bind(function(game) {
					this.game = game;
					console.log("Successfully loaded / joined game");
				}, this))
				.catch(function() {

					// Could be done using 'game.leave'
					Cookies.remove('gameId');
					Cookies.remove('playerId');

					console.log("Failed to load / join game");
				})
				.always(_.bind(this.onPreloadComplete, this));
			}
			else
			{
				console.log("No game to resume");
				this.onPreloadComplete();
			}
		},

		onPreloadComplete: function()
		{
			// Start routing
			console.log("Starting Backbone.history");
			Backbone.history.start();
		},

		show: function(view)
		{
			console.log("Show");
			this.rootLayout.showChildView('main', view);
		}
	});

	var app;
	return function() {
		if (!app)
		{
			app = new Application();
		}

		return app;
	}
});
