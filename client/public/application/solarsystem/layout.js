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
			mapLocation: '#map',
			planetPreviewLocation: '#planetpreview'
		},

		events: {
			'click a[data-control=nav]': 'onNavigate'
		},

		initialize: function(options)
		{
			Marionette.View.prototype.initialize.call(this, options);
		},

		onRender: function()
		{
			var map = new BasicMap();
			this.showChildView('mapLocation', map);

			// Have the main layout proxy the planet selection as the current planet needs to be remembered for later navigation
			this.listenTo(map, 'childview:planet:selected', _.partial(this.triggerMethod, 'planet:selected'));
		},

		onPlanetSelected: function(view)
		{
			// Some navigation links should navigate to planet details; so remember which planet is selected...
			this.planet = view.model;

			this.showChildView('planetPreviewLocation', new Marionette.View({
				template: _.template('<%- name %>'),
				model: view.model
			}));
		},

		onNavigate: function()
		{
			event.preventDefault();

			if (this.planet)
			{
				var href = $(event.target).attr('href');
				href = href.replace(':id', this.planet.id);
				Backbone.history.navigate(href);
			}
		}
	});

	return Layout;
});
