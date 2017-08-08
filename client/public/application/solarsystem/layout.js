define(['backbone.marionette',
       'solarsystem/basicmap',
       'tpl!solarsystem/templates/layout.html'],
       function(Marionette,
                BasicMap,
                template) {
	'use strict';

	var Layout = Marionette.View.extend({
		template: template,

		regions: {
			mapLocation: '#map'
		},

		initialize: function(options)
		{
			Marionette.View.prototype.initialize.call(this, options);
		},

		onRender: function()
		{
			this.showChildView('mapLocation', new BasicMap({
				
			}));
		}
	});

	return Layout;
});
