define(['backbone.marionette',
       'solarsystem/basicmap',
       'data/game',
       'backbone.poller',
       'tpl!solarsystem/templates/layout.html'],
       function(Marionette,
                BasicMap,
                Game,
                Poller,
                template) {
	'use strict';

	var Layout = Marionette.View.extend({
		template: template,

		regions: {
			mapLocation: '#map',
			dateLocation: '#date',
			planetPreviewLocation: '#planetpreview'
		},

		events: {
			'click a[data-control=nav]': 'onNavigate',
			'click a[data-control=terraform]': 'onTerraform'
		},

		initialize: function(options)
		{
			Marionette.View.prototype.initialize.call(this, options);
		},

		onRender: function()
		{
			var map = new BasicMap();
			this.showChildView('mapLocation', map);

			var game = new Game({ id: 'default', date: '' });
			this.showChildView('dateLocation', new Marionette.View({
				template: _.template('<%- date.day %>/<%- date.year %>'),
				model: game,
				modelEvents: {
					change: 'render'
				}
			}));

			var poller = Poller.get(game, { delay: 1000 });
			poller.start();
			this.on('destroy', function() { poller.destroy(); });

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
		},

		onTerraform: function()
		{
			if (this.plent)
			{
				this.planet.terraform();
			}
		}
	});

	return Layout;
});
