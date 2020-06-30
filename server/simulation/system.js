// system.js represents the core of the Sypremacy game world
var planet = require("./planet");

function System(system_size)
{
	// all planets within the system
	this.planets = [];
	// all ships within the system
	this.ships = [];
	this.initialize(system_size);
}

System.prototype.dumpState = function()
{
	console.log("Planet		Pop		Growth (%)	Food		Energy");
	for (var index = 0, length = this.planets.length; index < length; ++index)
	{
		var planet = this.planets[index];

		console.log(index + "		" + Math.floor(planet.population) + "		" + Math.floor(planet.growth) + " ("+ (planet.starvation) + ")	" + Math.floor(planet.food) + "		" + Math.floor(planet.energy));
	}

	console.log();
	console.log();
}

System.prototype.update = function(delta)
{
	for (var index = 0, length = this.ships.length; index < length; ++index)
	{
		this.ships[index].update(delta);
	}

	for (var index = 0, length = this.planets.length; index < length; ++index)
	{
		this.planets[index].update(delta);
	}
}

System.prototype.initialize = function(system_size)
{
	if (2 > Number(system_size))
	{
		system_size = 2;
		console.log("Invalid system size; minimum 2");
	}

	console.log("Initializing system ( planets=", system_size, ")");

	// create 'system_size' number of planets seperate the planets 'y' coordinate spacing the planets equally
	// over the maximum height (default 600px)
	var space = 600 / system_size;
	for (var index = 0; index < system_size; ++index)
	{
		var coordinates = { x: 0, y: index * space };
		this.planets.push(new planet.planet(coordinates));
	}
}

// Assign the planet to the specified player
System.prototype.terraform = function(at, player)
{
	if (at < this.planets.length)
	{
		this.planets[at].terraform(player);
	}
}

// Assign the planet to the specified player
System.prototype.capture = function(at, player)
{
	if (at < this.planets.length)
	{
		this.planets[at].capture(player);
	}
}

module.exports.system = System;
