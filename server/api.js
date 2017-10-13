const debug = require('debug')('server');
const http = require('http');
const Router = require('node-simple-router');
const GamesRouter = require('./routers/games');
const PlanetsRouter = require('./routers/planets');
const ShipsRouter = require('./routers/ships');
const ShipyardRouter = require('./routers/shipyard');
const _ = require('underscore');

class API
{
	constructor(options)
	{
	}

	start(options)
	{
		options = _.extend({
			port: 2000,
			ip: '127.0.0.1'
		}, options);

		var router = new Router({
			serve_static: false,
			list_dir: false,
			serve_cgi: false,
			serve_php: false,
			logging: false
		});

		// router.setSessionHandler(function() {
		// 	console.log("SESSION HANDLER!", arguments);
		// });

		// Create the specialized routers utilizing the generic 'node-simple-router' instance
		new GamesRouter(router);
		new PlanetsRouter(router);
		new ShipsRouter(router);
		new ShipyardRouter(router);

		this._server = http.createServer(router).listen(2000, );
		console.log("Server running on http://%s:%i/", options.ip, options.port);

		process.on('SIGINT', _.bind(this.stop, this));
		process.on('SIGHUP', _.bind(this.stop, this));
		process.on('SIGQUIT', _.bind(this.stop, this));
		process.on('SIGTERM', _.bind(this.stop, this));

		return this._server;
	}

	stop()
	{
		console.log("Server shutting down.");
		this._server.close();
		return process.exit(0);
	}

	get server()
	{
		return this._server;
	}
}

var instance = new API();
module.exports = function() {
	return instance;
};
