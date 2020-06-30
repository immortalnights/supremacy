
var system = require("./system");
var ships = require("./ship");
var simulation_speed = 0;

var game_system = null;

function initialize(system_size)
{
	game_system = new system.system(system_size);
}

function run(delta)
{
	game_system.update(delta);
}

function dumpState()
{
	game_system.dumpState();
}

function setPlayer(index, brain)
{
	if (2 <= index)
	{
		console.log("Invalid player index, must be 0 or 1");
	}
	else
	{
		// player 0 is always the "other" player
		// player 1 is the local player
		var home_planet = (0 == index) ? 0 : game_system.planets.length - 1;
		
		game_system.terraform(home_planet, null);
		game_system.capture(home_planet, null);
	}
}

function setSpeed(speed)
{
	simulation_speed = speed;
}

function begin()
{
	var timer = 100;
	var last_tick = (Date.now());
	setInterval(function() {
		var now = Date.now();
		var delta = (now - last_tick);
		last_tick = now;

		run(delta / 1000);
	}, timer);

	setInterval(function() {
		dumpState();
	}, 1000);

	// setTimeout(function() {
	// 	console.log("Timeout");
	// 	var ship = game_system.planets[1].build("T1", "horticultural");
	// 	game_system.planets[1].land(ship);
	// }, 5000);
}

function getSystem()
{
	return game_system;
}

module.exports.initialize = initialize;
module.exports.begin = begin;
module.exports.setPlayer = setPlayer;
module.exports.setSpeed = setSpeed;

module.exports.getSystem = getSystem;
