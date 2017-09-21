define(['routers/core',
       'backbone',
       'backbone.marionette',
       'overview/layout',
       'surface/layout',
       'fleet/layout',
       'dock/layout',
       'defense/layout',
       'shipyard/layout',
       'platoons/layout'],
       function(CoreRouter,
                Backbone,
                Marionette,
                Overview,
                Surface,
                Fleet,
                Dock,
                Defense,
                Shipyard,
                Platoons) {
	'use strict';

	var Router = CoreRouter.extend({

		routes: {
			'Planet/:planet/Overview':     'overview',
			'Planet/:planet/Surface':      'surface',
			'Planet/:planet/Fleet':        'fleet',
			'Planet/:planet/Dock':         'dock',
			'Planet/:planet/Defense':      'defense',
			'Planet/:planet/Shipyard':     'shipyard',
			'Planet/:planet/Platoons':     'platoons'
		},

		initialize: function(options)
		{
			CoreRouter.prototype.initialize.call(this, options);
			console.log("Router initialized");
		},

		overview: function(planet)
		{
			this.loadPlanet(planet, Overview);
		},

		surface: function(planet)
		{
			this.loadPlanet(planet, Surface);
		},

		fleet: function(planet)
		{
			this.loadPlanet(planet, Fleet);
		},

		dock: function(planet)
		{
			this.loadPlanet(planet, Dock);
		},

		defense: function(planet)
		{
			this.loadPlanet(planet, Defense);
		},

		shipyard: function(planet)
		{
			this.loadPlanet(planet, Shipyard);
		},

		platoons: function(planet)
		{
			this.loadPlanet(planet, Platoons);
		},

		loadPlanet: function(planet, Screen)
		{
			// Load the planet information, and display the view
			var Planets = require('data/planets');

			var planet = new (Planets.prototype.model)({ id: planet });

			this.listenToOnce(planet, 'sync', function(model, response, options) {
				this.getApp().show(new Screen({
					model: model
				}));
			});

			this.listenToOnce(planet, 'error', function(model, response, options) {
				this.getApp().show(new Marionette.View({
					model: new Backbone.Model(response.responseJSON),
					template: _.template('<p><%- message %></p>')
				}))
			});

			this.listenToOnce(planet, 'sync error', function(model) {
				this.stopListening(model);
			});
			planet.fetch();
		}
	});

	return Router;
});
