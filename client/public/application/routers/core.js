define(['backbone.marionette',
       'cookies'],
       function(Marionette,
                Cookies) {
	'use strict';

	var CoreRouter = Marionette.AppRouter.extend({
		execute: function(callback, args, name)
		{
			var gameId = Cookies.get('gameId');

			if (name === 'index' && !_.isEmpty(gameId))
			{
				Backbone.history.navigate('#/System');
			}
			else if (name !== 'index' && _.isEmpty(gameId))
			{
				Backbone.history.navigate('');
			}
			else
			{
				// Continue to requested page
				Marionette.AppRouter.prototype.execute.call(this, callback, args, name);
			}
		}
	});

	return CoreRouter;
});
