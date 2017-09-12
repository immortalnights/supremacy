define(['backbone'], function(Backbone) {

	var Ship = Backbone.Model.extend({
		initialize: function(attributes, options)
		{
			Backbone.Collection.prototype.initialize.call(this, attributes, options);
		},

		invoke: function(action, data)
		{
			return Backbone.ajax(this.url() + '/' + action + '/invoke', {
				method: 'put',
				data: JSON.stringify(data || {}),
				contentType: 'application/json'
			});
		}
	});

	var Ships = Backbone.Collection.extend({
		url: 'app/ships',
		model: Ship,

		initialize: function(models, options)
		{
			Backbone.Collection.prototype.initialize.call(this, models, options);
		}
	});

	return Ships;
});
