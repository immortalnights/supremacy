const debug = require('debug')('server');
const http = require('http');
const Router = require('node-router');
const Game = require('./game');

var game = new Game();
game.populate(8);
game.start();

var router = Router();
var route = router.push;

route('GET', '/planets', planetsHandler);

route(function(req, res, next) {
	// Catch all;
	res.send('404');
});

route(function(err, req, res, next) {
	res.send(err);
});

http.createServer(router).listen(2000, '127.0.0.1');


function planetsHandler(req, res, next) {
	res.send(game.planets);
}

debug("Server running at http://127.0.0.1:2000/");
