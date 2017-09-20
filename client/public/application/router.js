define(['backbone.marionette',
       'routers/core',
       'routers/planet',
       'menu/layout',
       'solarsystem/layout',
       'cookies'],
       function(Marionette,
                CoreRouter,
                PlanetRouter,
                Menu,
                System,
                Cookies) {
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
			// TODO
			Backbone.history.navigate('#/System');

			// app().show(new Menu());
		},

		system: function()
		{
			console.log("router:system");

			if (this.checkGame())
			{
				app().show(new System());
			}
			else
			{
				Backbone.history.navigate('', true);
			}
		},

		notFound: function()
		{
		}
	});

	return Router;
});
