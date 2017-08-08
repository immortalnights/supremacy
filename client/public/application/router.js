define(['backbone.marionette',
       'solarsystem/layout'], function(Marionette, SystemOverview) {
	'use strict';

	var app = function()
	{
		return require('application')();
	}

	var Router = Marionette.AppRouter.extend({
		routes: {
			'':               'index',
			'System':        'system',
			'Planet':        'planet',
			'*notFound':     'notFound'
		},

		initialize: function(options)
		{
			Marionette.AppRouter.prototype.initialize.call(this, options);
			console.log("Router initialized");
		},

		index: function()
		{
			console.log("router:index");
			Backbone.history.navigate('#/System');
		},

		system: function()
		{
			console.log("router:system");

			app().show(new SystemOverview());
		},

		planet: function()
		{

		},

		notFound: function()
		{

		}
	});

	return Router;
});
