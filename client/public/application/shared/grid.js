define(['backbone.marionette'],
       function(Marionette) {
	'use strict';

	var Grid = Marionette.NextCollectionView.extend({
		className: 'inventory grid',
		childView: Marionette.View,
		childViewOptions: {
			triggers: {
				'click': 'clicked'
			}
		},

		initialize: function(options)
		{
			console.assert(!options.childViewOptions || !options.childViewOptions.triggers);
			// Apply childViewOption defaults. options.childViewOptions has already been applied to `this`
			_.extend(this.childViewOptions, Grid.prototype.childViewOptions);

			Marionette.NextCollectionView.prototype.initialize.call(this, options);
		}
	});

	return Grid;
});
