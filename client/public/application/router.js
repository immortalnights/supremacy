define(['backbone.marionette',
       'solarsystem/layout',
       'overview/layout',
       'surface/layout',
       'fleet/layout',
       'dock/layout',
       'defense/layout',
       'shipyard/layout',
       'platoons/layout'],
       function(Marionette,
                System,
                Overview,
                Surface,
                Fleet,
                Dock,
                Defense,
                Shipyard,
                Platoons) {
	'use strict';

	var app = function()
	{
		return require('application')();
	}

	var PlanetRouter = Marionette.AppRouter.extend({

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
			Marionette.AppRouter.prototype.initialize.call(this, options);
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
				app().show(new Screen({
					model: model
				}));
			});

			this.listenToOnce(planet, 'error', function(model, response, options) {
				app().show(new Marionette.View({
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



	var Router = Marionette.AppRouter.extend({
		routes: {
			'':                     'index',
			'System':               'system',
			'*notFound':            'notFound'
		},

		initialize: function(options)
		{
			Marionette.AppRouter.prototype.initialize.call(this, options);
			console.log("Router initialized");

			new PlanetRouter();
		},

		index: function()
		{
			console.log("router:index");
			Backbone.history.navigate('#/System');
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
