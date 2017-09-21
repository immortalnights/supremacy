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
			// Assumes hosting cannot fail!
			Game.host({
				type: 'singleplayer',
				opponent: 'wotok'
			})
			.then(this.onJoinedGame)
			.catch(function(data, textStatus, xhr) {
				console.error(textStatus, data);
			});
		},

		onHostGame: function()
		{
			// Assumes hosting cannot fail!
			Game.host({
				type: 'multiplayer'
			})
			.then(this.onJoinedGame)
			.catch(function(data, textStatus, xhr) {
				console.error(textStatus, data);
			});
		},

		onJoinGame: function()
		{
			var selectedGameId = 'unknown-id';

			Game.join({
				id: selectedGameId
			})
			.then(this.onJoinedGame)
			.catch(function(data, textStatus, xhr) {
				console.error(textStatus, data);
			});
		},

		onJoinedGame: function(data, textStatus, xhr)
		{
			/*
			 * Prevent Backbone from handling the unavoidable hash-change event.
			 */
			Backbone.history.stop();

			window.location = window.location.protocol + '//' + window.location.host + '/#/System';
			window.location.reload();
		}
	});

	return Layout;
});
