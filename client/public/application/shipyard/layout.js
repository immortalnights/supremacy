define(['backbone.marionette',
       'data/blueprints',
       'tpl!shipyard/templates/layout.html'],
       function(Marionette,
                Blueprints,
                template) {
	'use strict';

	var Layout = Marionette.View.extend({
		template: _.template('<div id="shipyarditem"></div>'),

		regions: {
			itemLocation: '#shipyarditem'
		},

		initialize: function(options)
		{
			Marionette.View.prototype.initialize.call(this, options);
		},

		onRender: function()
		{
			var blueprints = new Blueprints();
			blueprints.fetch();

			var selected = 0;
			this.listenToOnce(blueprints, 'sync', function(collection) {
				this.trigger('view', selected);
			});

			this.on('childview:show:previous', function() {
				--selected;
				if (selected < 0)
				{
					selected = blueprints.length - 1;
				}

				this.trigger('view', selected);
			});

			this.on('childview:show:next', function() {
				++selected;
				if (selected == blueprints.length)
				{
					selected = 0;
				}

				this.trigger('view', selected);
			});

			this.on('childview:build', function() {
				var blueprint = blueprints.at(selected);

				console.log("Build", blueprint);
				blueprint.build();
			});

			this.on('view', function(index) {
				this.showChildView('itemLocation', new Marionette.View({
					template: template,
					model: blueprints.at(index),

					triggers: {
						'click [data-control=previous]': 'show:previous',
						'click [data-control=next]': 'show:next',
						'click [data-control=build]': 'build'
					}
				}));
			});
		}
	});

	return Layout;
});
