define(['backbone'],
       function(Backbone) {
	'use strict';

	var Game = Backbone.Model.extend({
		url: 'app/game',

		initialize: function(attributes, options)
		{
			Backbone.Model.prototype.initialize.call(this, attributes, options);
		}
	});

	return Game;
});
