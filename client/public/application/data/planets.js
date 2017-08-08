define(['backbone'], function(Backbone) {

	var Planets = Backbone.Collection.extend({
		url: 'app/planets',

		initialize: function(models, options)
		{
			Backbone.Collection.prototype.initialize.call(this, models, options);
		}
	});

	return Planets;
});
