define(['backbone.marionette',
       'shared/list',
       'shared/slots',
       'data/ships'],
       function(Marionette,
                List,
                slots,
                Ships) {
	'use strict';

	var DockingBay = List.extend({
		className: 'docking-bay inventory',

		initialize: function(options)
		{
			this.ships = new Ships();
			this.collection = slots(this.ships, 3, "Empty");
		},

		onBeforeRender: function()
		{
			this.refresh();
		},

		refresh: function()
		{
			this.ships.fetch({
				data: {
					'location.planet': this.getOption('planet'),
					'location.position': 'dock'
				}
			});
		}
	});

	return DockingBay;
});
