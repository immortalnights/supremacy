define(['backbone.marionette',
       'data/game',
       'tpl!menu/templates/layout.html'],
       function(Marionette,
                Game,
                template) {
	'use strict';

	var Layout = Marionette.View.extend({
		template: template,

		events: {
			'click button[data-control="play"]': 'onStartGame',
			'click button[data-control="host"]': 'onHostGame',
			'click button[data-control="join"]': 'onJoinGame'
		},

		onStartGame: function()
		{
			var game = new Game({
				players: 1
			});
			game.save();
		},

		onHostGame: function()
		{
			var game = new Game({
				players: 1,
				name: 'My Game'
			});
			game.save();
		},

		onJoinGame: function()
		{
			var selectedGameId = 'unknown-id';
			var game = new Game({
				id: selectedGameId
			});
			game.fetch();
		}
	});

	return Layout;
});
