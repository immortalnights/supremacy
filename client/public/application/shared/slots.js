define(['backbone'],
       function(Backbone) {
	'use strict';

	// Returns a collection, populated from another with at least `count` items within it.
	return function(data, count, placeholder) {
		var items = new Backbone.Collection();
		items.listenTo(data, 'sync', function(collection, response, options) {
			items.set(collection.models);

			_.each(_.range(count - items.length), function() {
				items.push({
					name: placeholder
				});
			});
		});
		return items;
	};
});
