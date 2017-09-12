define(['backbone.marionette',
       'routers/core',
       'routers/planet',
       'menu/layout',
       'cookies'],
       function(Marionette,
                CoreRouter,
                PlanetRouter,
                Menu,
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
			app().show(new Menu());
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
