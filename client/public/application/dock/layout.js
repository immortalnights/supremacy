define(['backbone.marionette',
       'shared/dockingbay',
       'data/ships',
       'tpl!dock/templates/layout.html',
       'tpl!dock/templates/shipdetails.html',
       'tpl!dock/templates/shipcontrols.html'],
       function(Marionette,
                DockingBay,
                Ships,
                template,
                shipDetailsTemplate,
                shipControlsTemplate) {
	'use strict';

	var Layout = Marionette.View.extend({
		template: template,

		ui: {
			shipControls: 'fieldset[data-role="shipcontrols"]'
		},

		regions: {
			dockingBayLocation: '#dockingbay',
			shipDetailsLocation: '#shipdetails',
			shipControlsLocation: '#shipcontrols'
		},

		events: {
			'click [data-control="crew"]': 'onCrewShip',
			'click [data-control="unload"]': 'onUnloadShip',
			'click [data-control="delete"]': 'onDeleteShip'
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

			this.listenTo(dockingBay, 'childview:clicked', this.onShipSelected);
			this.showChildView('dockingBayLocation', dockingBay);

			this.showShipDetails(null);

			// dockingBay.selectFirst()
		},

		onShipSelected: function(view, event)
		{
			var ship = view.model;

			this.stopListening(this.selectedShip);

			if (ship instanceof Ships.prototype.model)
			{
				this.listenToOnce(ship, 'sync', this.showShipDetails);
				ship.fetch();
			}

			// use member to remember the selected ship
			this.selectedShip = ship;
		},

		onCrewShip: function()
		{
			if (this.selectedShip)
			{
				this.selectedShip.invoke('crew');
			}
		},

		onUnloadShip: function()
		{
			if (this.selectedShip)
			{
				this.selectedShip.invoke('unload');
			}
		},

		onDeleteShip: function()
		{
			if (this.selectedShip)
			{
				this.stopListening(this.selectedShip);
				this.selectedShip.destroy();
				this.selectedShip = null;
				this.showShipDetails(null);
			}
		},

		showShipDetails: function(ship)
		{
			if (!ship)
			{
				ship = new Backbone.Model({
					passengers: null,
					fuel: null,
					class: null,
					name: null,
					civilians: null,
					seats: null,
					requiredCrew: null,
					capacity: null,
					maximumFuel: null,
					payload: null,
					value: null
				});
			}

			this.showChildView('shipDetailsLocation', new Marionette.View({
				template: shipDetailsTemplate,
				model: ship
			}));

			this.showChildView('shipControlsLocation', new Marionette.View({
				template: shipControlsTemplate,
				model: ship
			}));

			this.ui.shipControls.prop('disabled', !!ship);
		}
	});

	return Layout;
});
