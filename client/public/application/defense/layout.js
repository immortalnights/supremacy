define(['backbone.marionette',
       'shared/dockingbay',
       'tpl!defense/templates/layout.html'],
       function(Marionette,
                DockingBay,
                template) {
	'use strict';

	var Layout = Marionette.View.extend({
		template: template,

		regions: {
			dockingBayLocation: '#dockingbay'
		},

		initialize: function(options)
		{
			Marionette.View.prototype.initialize.call(this, options);
		},

		onRender: function()
		{
			this.showChildView('dockingBayLocation', new DockingBay({
				planet: this.model.id
			}));
		}
	});

	return Layout;
});
