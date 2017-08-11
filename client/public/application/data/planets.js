define(['backbone'], function(Backbone) {

	var Planet = Backbone.Model.extend({
		urlRoot: 'app/planets',

		initialize: function(attributes, options)
		{
			Backbone.Model.prototype.initialize.call(this, attributes, options);
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
