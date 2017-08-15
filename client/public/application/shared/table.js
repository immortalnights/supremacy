define(['backbone.marionette'],
       function(Marionette) {
	'use strict';

	var TableBody = Marionette.NextCollectionView.extend({
		tagName: 'tbody',
		childView: Marionette.View,
		childViewOptions: {
			tagName: 'tr',
			triggers: {
				'click': 'clicked'
			}
		},

		initialize: function(options)
		{
			// Apply childViewOption defaults. options.childViewOptions has already been applied to `this`
			_.extend(this.childViewOptions, TableBody.prototype.childViewOptions);
			Marionette.NextCollectionView.prototype.initialize.call(this, options);
		}
	});

	var Table = Marionette.View.extend({

		regions: {
			'tableBody': {
				el: 'tbody',
				replaceElement: true
			}
		},

		initialize: function(options)
		{
			Marionette.View.prototype.initialize.call(this, options);
		},

		onRender: function()
		{
			var body =  new TableBody({
				collection: this.collection,
				childViewOptions: {
					template: _.template('<%- name %>')
				}
			});
			this.showChildView('tableBody', body);

			this.listenTo(body, 'childview:clicked', _.partial(this.triggerMethod, 'row:selected'));
		}
	});

	return Table;
});
