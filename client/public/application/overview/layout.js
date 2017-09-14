define(['backbone.marionette',
       'backbone.poller',
       'shared/grid',
       'shared/list',
       'shared/slots',
       'data/planets',
       'data/ships',
       'tpl!overview/templates/layout.html',
       'tpl!overview/templates/planetdetails.html'],
       function(Marionette,
                Poller,
                Grid,
                List,
                slots,
                Planets,
                Ships,
                template,
                planetDetailsTemplate) {
	'use strict';

	var Layout = Marionette.View.extend({
		template: template,

		regions: {
			planetDetailsLocation: '#planetdetails',
			// messages
			systemPlanetsLocation: '#systemplanets',
			planetInventoryLocation: '#planetinventory'
		},

		triggers: {
			'click button[data-control="view"]': 'change:view'
		},

		initialize: function(options)
		{
			Marionette.View.prototype.initialize.call(this, options);
		},

		onRender: function()
		{
			var poller = Poller.get(this.model, {
				delay: 1000
			});
			poller.start();

			this.on('destroy', function() {
				poller.destroy();
			});

			// Display planet information
			// TODO only 'select' own planets
			this.showChildView('planetDetailsLocation', new Marionette.View({
				model: this.model,
				template: planetDetailsTemplate,
				modelEvents: {
					change: 'render'
				}
			}));

			this.on('change:view', function(view, event) {
				var location = $(event.target).val();
				this.showPlanetInventory(location);
			});

			var planets = new Planets();
			var grid = new Grid({
				collection: slots(planets, 32, ""),
				childViewOptions: {
					template: _.template('<%- name %>')
				}
			});

			planets.fetch();

			this.showChildView('systemPlanetsLocation', grid);

			this.listenTo(grid, 'childview:clicked', function(view, event) {
				// this.triggerMethod('planet:selected', view.model);
				Backbone.history.navigate('#/Planet/' + view.model.id + '/Overview');
			});

			this.showPlanetInventory('orbit');
		},

		showPlanetInventory: function(location)
		{
			// Display planet inventory (orbit by default)
			var ships = new Ships();
			ships.fetch({
				reset: true,
				data: {
					'location.planet': this.model.id,
					'location.position': location
				}
			});

			this.showChildView('planetInventoryLocation', new List({
				className: 'inventory',
				collection: slots(ships, 6, "Empty")
			}));
		}
	});

	return Layout;
});
