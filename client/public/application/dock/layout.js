define(['backbone.marionette',
       'shared/dockingbay',
       'tpl!dock/templates/layout.html',
       'tpl!dock/templates/shipdetails.html',
       'tpl!dock/templates/shipcontrols.html'],
       function(Marionette,
                DockingBay,
                template,
                shipDetailsTemplate,
                shipControlsTemplate) {
	'use strict';

	var Layout = Marionette.View.extend({
		template: template,

		regions: {
			dockingBayLocation: '#dockingbay',
			shipDetailsLocation: '#shipdetails',
			shipControlsLocation: '#shipcontrols'
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
