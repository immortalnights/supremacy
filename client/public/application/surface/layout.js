define(['backbone',
       'backbone.marionette',
       'shared/dockingbay',
       'shared/list',
       'shared/slots',
       'data/ships',
       'tpl!surface/templates/layout.html'],
       function(Backbone,
                Marionette,
                DockingBay,
                List,
                slots,
                Ships,
                template) {
	'use strict';

	var Layout = Marionette.View.extend({
		template: template,

		regions: {
			dockLocation: '#dockingbay',
			surfaceLocation: '#surfacelocations'
		},

		initialize: function(options)
		{
			Marionette.View.prototype.initialize.call(this, options);
		},

		onRender: function()
		{
			var planet = this.model.id;

			var surfaceShips = new Ships();

			var refresh = function() {
				surfaceShips.fetch({
					data: {
						'location.planet': planet,
						'location.position': 'surface'
					}
				});
			}

			var dockingBay = new DockingBay({
				planet: this.model.id
			});
			this.showChildView('dockLocation', dockingBay);

			this.listenTo(dockingBay, 'childview:clicked', function(view) {
				var ship = view.model;
				if (ship instanceof Ships.prototype.model)
				{
					ship.invoke('land')
					.then(function() {
						refresh();
						dockingBay.render();
					});
				}
			});

			var surfaceList = new List({
				className: 'inventory',
				collection: slots(surfaceShips, 6, "Empty")
			});

			this.showChildView('surfaceLocation', surfaceList);

			this.listenTo(surfaceList, 'childview:clicked', function(view) {
				var ship = view.model;
				if (ship instanceof Ships.prototype.model)
				{
					ship.invoke('dock')
					.then(function() {
						refresh();
						// view.render();
						dockingBay.render();
					});
				}
			});

			refresh();
		}
	});

	return Layout;
});
