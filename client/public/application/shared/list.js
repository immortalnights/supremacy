define(['backbone.marionette'],
       function(Marionette) {
	'use strict';

	var List = Marionette.NextCollectionView.extend({
		tagName: 'ul',
		childView: Marionette.View,
		childViewOptions: {
			tagName: 'li',
			template: _.template('<%- name %>'),

			triggers: {
				'click': 'clicked'
			}
		},

		initialize: function(options)
		{
			_.defaults(this.childViewOptions, List.prototype.childViewOptions);

			Marionette.NextCollectionView.prototype.initialize.call(this, options);
		}
	});

	return List;
});
