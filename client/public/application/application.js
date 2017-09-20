define(['backbone.marionette',
       'routers/index',
       'data/game'],
       function(Marionette,
                Router,
                Game) {
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
				game.fetch()
				.then(_.bind(function(game) {
					this.game = game;
					console.log("Successfully loaded / joined game");
				}, this))
				.catch(function() {
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
