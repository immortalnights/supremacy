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

		ui: {
			shipControls: 'fieldset[data-role="shipcontrols"]',
			message: '#messages'
		},

		regions: {
			dockingBayLocation: '#dockingbay',
			shipDetailsLocation: '#shipdetails',
			inventoryLocation: '#inventory'
		},

		events: {
			'click [data-control="launch"]': 'onLaunchShip',
			'click [data-control="transfer"]': 'onTransferShip',
			'click [data-control="dock"]': 'onDockShip',
			'click [data-control="cencelmission"]': 'onCancelShipMission',
			'click [data-control="rename"]': 'onRenameShip'
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

			this.stopListening(this.selectedShip);

			if (ship instanceof Ships.prototype.model)
			{
				this.listenTo(ship, 'change:location', function(ship) {
					this.ui.message.text(ship.get('location').summary);
				});
				
				this.listenToOnce(ship, 'sync', function(model) {
					this.ui.message.text(ship.get('location').summary);

					this.showChildView('shipDetailsLocation', new Marionette.View({
						template: shipDetailsTemplate,
						model: model
					}));

					this.ui.shipControls.prop('disabled', false);
				})
				ship.fetch();
			}

			// use member to remember the selected ship
			this.selectedShip = ship;
		},

		onLaunchShip: function()
		{
			this.selectedShip.invoke('launch');
		},

		onTransferShip: function()
		{
			// original version updated the grid to display planets and required the user to select one...
			// this.selectedShip.invoke('transfer');
		},

		onDockShip: function()
		{
			this.selectedShip.invoke('dock');
		},

		onCancelShipMission: function()
		{
			this.selectedShip.invoke('cancelmission');
		},

		onRenameShip: function()
		{
			// Display dialog for rename
			// this.selectedShip.set('name', newName);
			// this.selectedShip.save();
		}
	});

	return Layout;
});
