
class Controller
{
	constructor()
	{
		this._games = {}
	}

	get games()
	{
		return this._games;
	}

	create(options)
	{
		var game;
		console.log("Create game", options);
		// create a new game give the options

		return game;
	}

	remove(id)
	{
		unset(this.games[id]);
	}
}

var instance = new Controller();
module.exports = function() {
	return instance;
};
