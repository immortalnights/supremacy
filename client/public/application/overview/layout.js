define(['backbone.marionette',
       'data/planets',
       'data/ships',
       'shared/table',
       'tpl!overview/templates/layout.html',
       'tpl!overview/templates/planetdetails.html'],
       function(Marionette,
                Planets,
                Ships,
                Table,
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
			// Display planet information
			// TODO only 'select' own planets
			this.showChildView('planetDetailsLocation', new Marionette.View({
				model: this.model,
				template: planetDetailsTemplate
			}));

			this.on('change:view', function(view, event) {
				var location = $(event.target).val();
				this.showPlanetInventory(location);
			});

			// Display planet table (TODO highlight selected)
			var planets = new Planets();
			planets.fetch();

			var planetTable = new Table({
				template: _.template('<table><thead></thead><tbody></tbody><tfoot></tfoot></table>'),
				collection: planets,
			});
			this.showChildView('systemPlanetsLocation', planetTable);

			this.listenTo(planetTable, 'row:selected', function(view) {
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
				data: {
					'location.planet': this.model.id,
					'location.position': location
				}
			});

			this.showChildView('planetInventoryLocation', new Table({
				template: _.template('<table><thead></thead><tbody></tbody><tfoot></tfoot></table>'),
				collection: ships
			}));
		}
	});

	return Layout;
});
