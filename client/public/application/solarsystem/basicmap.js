define(['shared/list',
       'data/planets',
       'backbone.poller'],
       function(List,
                Planets,
                Poller) {
	'use strict';

	var SystemMap = List.extend({
		tagName: 'ol',
		className: 'inventory',

		childViewOptions: {
			tagName: 'li',
			template: _.template('<a data-control="planet"><%- name %></a>'),

			triggers: {
				'click a[data-control=planet]': 'planet:selected'
			}
		},

		initialize: function(options)
		{
			List.prototype.initialize.call(this, options);
		},

		onRender: function()
		{
			this.collection = new Planets();
			var poller = Poller.get(this.collection, { delay: 1000, delayed: 0 }).start();

			this.on('destroy', function() {
				poller.destroy();
			})

			this.listenToOnce(this.collection, 'sync', function(collection) {
				// Auto-select the final planet (This is by default the players Starbase)
				var child = this.children.findByModel(collection.last());
				if (child)
				{
					this.triggerMethod('childview:planet:selected', child);
				}
			});
		},

		onChildviewPlanetSelected: function(view, event)
		{
			console.log("Selected '%s'", view.model.get('name'), view.model);
		}
	});

	return SystemMap;
})
