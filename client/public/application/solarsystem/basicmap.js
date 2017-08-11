define(['backbone.marionette',
       'data/planets'],
       function(Marionette,
                Planets) {
	'use strict';

	var SystemMap = Backbone.Marionette.NextCollectionView.extend({
		tagName: 'ol',

		childView: Marionette.View,
		childViewOptions: {
			tagName: 'li',
			template: _.template('<a data-control="planet"><%- name %></a>'),

			triggers: {
				'click a[data-control=planet]': 'planet:selected'
			}
		},

		initialize: function(options)
		{
			Marionette.NextCollectionView.prototype.initialize.call(this, options);

			this.collection = new Planets();
			this.collection.fetch();

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
