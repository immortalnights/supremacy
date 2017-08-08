define(['backbone.marionette', 'data/planets'], function(Marionette, Planets) {
	'use strict';

	var SystemMap = Backbone.Marionette.NextCollectionView.extend({
		tagName: 'ol',

		childView: Marionette.View,
		childViewOptions: {
			tagName: 'li',
			template: _.template('<a data-control="planet"><%- name %></a>'),

			triggers: {
				'click a[data-control=planet]': 'select:planet'
			}
		},

		initialize: function(options)
		{
			Marionette.NextCollectionView.prototype.initialize.call(this, options);

			this.collection = new Planets();
			this.collection.fetch();
		},

		onChildviewSelectPlanet: function(view, event)
		{
			console.log("Selected", view.model.get('name'));
		}
	});

	return SystemMap;
})
