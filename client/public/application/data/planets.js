define(['backbone'], function(Backbone) {

	var Planet = Backbone.Model.extend({
		urlRoot: 'app/planets',

		initialize: function(attributes, options)
		{
			Backbone.Model.prototype.initialize.call(this, attributes, options);
		},

		terraform: function()
		{
			var self = this;
			return Backbone.ajax(this.url() + '/terraform/invoke', {
				method: 'put',
				data: JSON.stringify(data || {}),
				contentType: 'application/json'
			}).then(function(data, textStatus, xhr) {
				self.set(data);
			});
		}
	});

	var Planets = Backbone.Collection.extend({
		url: 'app/planets',
		model: Planet,

		initialize: function(models, options)
		{
			Backbone.Collection.prototype.initialize.call(this, models, options);
		}
	});

	return Planets;
});
