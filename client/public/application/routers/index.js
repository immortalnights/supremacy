define(['backbone.marionette',
       'routers/core',
       'routers/planet',
       'data/game',
       'menu/layout',
       'solarsystem/layout'],
       function(Marionette,
                CoreRouter,
                PlanetRouter,
                Game,
                Menu,
                System) {
	'use strict';

	var app = function()
	{
		return require('application')();
	}

	var Router = CoreRouter.extend({
		routes: {
			'':                     'index',
			'System':               'system',
			'*notFound':            'notFound'
		},

		initialize: function(options)
		{
			CoreRouter.prototype.initialize.call(this, options);
			console.log("Router initialized");

			new PlanetRouter();
		},

		index: function()
		{
			console.log("router:index");

			// Automatically start and join a game...
			// Assumes hosting cannot fail!
			this.getApp().game = Game.host({
				type: 'singleplayer',
				opponent: 'wotok'
			});

			Backbone.history.navigate('#/System', true);

			// app().show(new Menu());
		},

		system: function()
		{
			console.log("router:system");
			app().show(new System());
		},

		notFound: function()
		{
		}
	});

	return Router;
});
