define(['backbone.marionette', 'router'], function(Marionette, Router) {
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

		onStart: function()
		{
			console.log("Started...");
			this.rootLayout = new RootLayout();

			// Start routing
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
