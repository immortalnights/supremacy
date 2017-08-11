define(['backbone'], function(Backbone) {
	'use strict';

	var Blueprint = Backbone.Model.extend({
		rootUrl: 'app/blueprints',

		initialize: function(attributes, options)
		{
			Backbone.Collection.prototype.initialize.call(this, attributes, options);
		},

		build: function(quantity)
		{
			quantity = quantity || 1;
			var url = _.result(this, 'url') + '/build/invoke';
			return Backbone.ajax(url, {
				method: 'POST',
				data: JSON.stringify({
					quantity: quantity
				})
			});
		}
	});

	var Blueprints = Backbone.Collection.extend({
		url: 'app/blueprints',
		model: Blueprint,

		initialize: function(models, options)
		{
			Backbone.Collection.prototype.initialize.call(this, models, options);
		}
	});

	return Blueprints;
});
