define(['backbone.marionette',
       'routers/core',
       'routers/planet',
       'menu/layout',
       'solarsystem/layout'],
       function(Marionette,
                CoreRouter,
                PlanetRouter,
                Menu,
                System) {
	'use strict';

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
			this.getApp().show(new Menu());
		},

		system: function()
		{
			console.log("router:system");
			this.getApp().show(new System());
		},

		notFound: function()
		{
		}
	});

	return Router;
});
