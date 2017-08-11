define(['backbone'], function(Backbone) {

	var Ship = Backbone.Model.extend({
		initialize: function(attributes, options)
		{
			Backbone.Collection.prototype.initialize.call(this, attributes, options);
		}
	});

	var Ships = Backbone.Collection.extend({
		url: 'app/ships',

		initialize: function(models, options)
		{
			Backbone.Collection.prototype.initialize.call(this, models, options);
		}
	});

	return Ships;
});
