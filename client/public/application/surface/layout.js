define(['backbone',
       'backbone.marionette',
       'shared/table',
       'data/ships',
       'tpl!surface/templates/layout.html'],
       function(Backbone,
                Marionette,
                Table,
                Ships,
                template) {
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
			Marionette.NextCollectionView.prototype.initialize.call(this, options);
		}
	});

	var Layout = Marionette.View.extend({
		template: template,

		regions: {
			dockLocation: '#dockingbay',
			surfaceLocation: '#surfacelocations'
		},

		initialize: function(options)
		{
			Marionette.View.prototype.initialize.call(this, options);
		},

		onRender: function()
		{
			var planet = this.model.id;

			var dockedShips = new Ships();
			var surfaceShips = new Ships();

			var refresh = function() {
				dockedShips.fetch({
					data: {
						'location.planet': planet,
						'location.position': 'dock'
					}
				});

				surfaceShips.fetch({
					data: {
						'location.planet': planet,
						'location.position': 'surface'
					}
				});
			}

			var slots = function(data, max) {
				var items = new Backbone.Collection();
				items.listenTo(data, 'sync', function(collection, response, options) {
					items.set(collection.models);

					_.each(_.range(max - items.length), function() {
						items.push({
							name: "Empty"
						});
					});
				});
				return items;
			}

			var dockList = new List({
				collection: slots(dockedShips, 3)
			});
			this.showChildView('dockLocation', dockList);

			this.listenTo(dockList, 'childview:clicked', function(view) {
				Backbone.ajax(view.model.url() + '/land/invoke').then(refresh);
			});

			var surfaceList = new List({
				collection: slots(surfaceShips, 6)
			});

			this.showChildView('surfaceLocation', surfaceList);

			this.listenTo(surfaceList, 'childview:clicked', function(view) {
				Backbone.ajax(view.model.url() + '/dock/invoke').then(refresh);
			});

			refresh();
		},

		onChildviewTransferToSurface: function()
		{
			debugger;
		}
	});

	return Layout;
});
