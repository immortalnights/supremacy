define(['backbone.marionette',
       'cookies'],
       function(Marionette,
                Cookies) {
	'use strict';

	var CoreRouter = Marionette.AppRouter.extend({
		// execute: function(callback, args, name)
		// {
		// 	var gameId = Cookies.get('gameId');

		// 	if (name === 'index' && !_.isEmpty(gameId))
		// 	{
		// 		Backbone.history.navigate('#/System');
		// 	}
		// 	else if (name !== 'index' && _.isEmpty(gameId))
		// 	{
		// 		Backbone.history.navigate('');
		// 	}
		// 	else
		// 	{
		// 		// Continue to requested page
		// 		Marionette.AppRouter.prototype.execute.call(this, callback, args, name);
		// 	}
		// }

		/**
		 * @returns true if player is in a game (has a game Id cookie)
		 */
		checkGame: function()
		{
			// var result = false;

			// var cookie = Cookies.get('gameId');
			// console.log("Game ID", cookie);
			
			// if (cookie)
			// {
			// 	// validate the game
			// 	var game = new Game({
			// 		id: cookie
			// 	});

			// 	result = game.fetch();
			// }

			return true;
		}
	});

	return CoreRouter;
});
