define(['backbone.marionette',
       'data/ships',
       'shared/dockingbay',
       'shared/slots',
       'shared/grid',
       'tpl!fleet/templates/layout.html',
       'tpl!fleet/templates/shipdetails.html'],
       function(Marionette,
                Ships,
                DockingBay,
                slots,
                Grid,
                template,
                shipDetailsTemplate) {
	'use strict';

	var Layout = Marionette.View.extend({
		template: template,

		regions: {
			dockingBayLocation: '#dockingbay',
			shipDetailsLocation: '#shipdetails',
			inventoryLocation: '#inventory'
		},

		initialize: function(options)
		{
			Marionette.View.prototype.initialize.call(this, options);
		},

		onRender: function()
		{
			var dockingBay = new DockingBay({
				planet: this.model.id
			});
			this.showChildView('dockingBayLocation', dockingBay);

			this.listenTo(dockingBay, 'childview:clicked', this.onShipSelected);

			var ships = new Ships();
			var grid = new Grid({
				collection: slots(ships, 32, ""),
				childViewOptions: {
					template: _.template('<%- name %>')
				}
			});

			ships.fetch();

			this.showChildView('inventoryLocation', grid);

			this.listenTo(grid, 'childview:clicked', this.onShipSelected);
		},

		onShipSelected: function(view, event)
		{
			var ship = view.model;

			if (ship instanceof Ships.prototype.model)
			{
				this.showChildView('shipDetailsLocation', new Marionette.View({
					template: shipDetailsTemplate,
					model: ship
				}));
			}
		}
	});

	return Layout;
});
