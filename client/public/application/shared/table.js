define(['backbone.marionette'],
       function(Marionette) {
	'use strict';

	var TableRow = Marionette.View.extend({
		tagName: 'tr',

		triggers: {
			'click': 'row:selected'
		}
	});

	var TableBody = Marionette.NextCollectionView.extend({
		tagName: 'tbody',
		childView: TableRow
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

			this.listenTo(body, 'childview:row:selected', _.partial(this.triggerMethod, 'row:selected'));
		}
	});

	return Table;
});
