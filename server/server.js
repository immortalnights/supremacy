const debug = require('debug')('server');
const http = require('http');
const Router = require('node-simple-router');
const GamesRouter = require('./routers/games');
const PlanetsRouter = require('./routers/planets');
const ShipsRouter = require('./routers/ships');
const ShipyardRouter = require('./routers/shipyard');
const _ = require('underscore');

var theServer = null;
const initialize = function() {

}

const start = function() {
}

const get = function() {
	return theServer;
}

module.exports = class Server {
	constructor()
	{
	}

	start(data, options)
	{
		options = _.extend({
			port: 2000,
			ip: '127.0.0.1'
		}, options);

		var router = new Router();
		new GamesRouter(data).bind(router);
		new PlanetsRouter(data).bind(router);
		new ShipsRouter(data).bind(router);
		new ShipyardRouter(data).bind(router);

		theServer = http.createServer(router).listen(2000, );
		debug("Server running on http://127.0.0.1:2000/");
		return theServer;
	}

	get server()
	{
		return this._server;
	}
};
