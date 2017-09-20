const Server = require('./server');
const Games = require('./data/games');
const _ = require('underscore');

(function() {
	// Initialize the collection of games
	var games = new Games();
	var server = new Server()
	server.start(games, {});
})();
