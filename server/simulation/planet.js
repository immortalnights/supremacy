
var ships = require("./ship");

function removeFromArray(array, property, item)
{
	for (i = 0; i < array.length; i++)
	{
		if (array[i] && array[i][property] === item[property])
		{
			array.splice(i, 1);
			break;
		}
	}
	return array;
}


function Planet(coordinates)
{
	this.coordinates = coordinates;
	
	this.name = "";
	this.owner = null;

	this.habitable = false;
	this.population = 0;
	// maximum increase in population per 1000
	this.birth_rate = 0;
	// maximum decrease in population per 1000
	this.mortality_rate = 0;
	this.growth = 0;
	this.growth_exact = 0;
	this.starvation = false;

	// 0 - 100
	this.tax = 0;

	this.food = 0;
	this.energy = 0;

	// ships in orbit, in the docks or on the surface
	this.ships = [];
}

Planet.prototype.build = function(name, ship_type)
{
	var ship = null;
	var template = ships.templates[ship_type];
	if (!template)
	{
		console.log("Invalid ship template for", ship_type);
	}
	// else if (!this.owner || this.owner.credits < template.cost)
	// {
	// 	console.log("planet owner cannot afford the ship", template.cost, this.owner.credits);
	// }
	else
	{
		console.log("Ship constructed", name, template.type);
		// pay for the ship
		// this.owner.credits -= template.cost;

		// build the ship
		ship = new ships.ship();
		ship.initialize(name, template);

		// add this ship to the dock
		ship.changeLocation(this, "docked");
	}
	return ship;
}

//! adds a ship to this planet
//! this ship could be in orbit, in the dock or on the surface
Planet.prototype.addShip = function(ship)
{
	this.ships.push(ship)
}

Planet.prototype.removeShip = function(ships)
{
	removeFromArray(this.ship, "name", ship);
}

Planet.prototype.terraform = function(player)
{
	console.log("Planet has been terraformed");
	this.owner = player;
	
	this.habitable = true;
	this.population = 1000;
	this.food = 1000000;
	this.energy = 25000;

	// the birth and mortality rate changes infrequently
	this.birth_rate = 24; //Math.floor((Math.random() * 9) + 17); // 17 - 26
	this.mortality_rate = 12; // Math.floor((Math.random() * 5) + 11); // 11 - 16
	this.growth = 0;

	this.tax = 0;
}

Planet.prototype.capture = function(player)
{
	console.log("Planet has been captured");
	this.owner = player;
}

Planet.prototype.update = function(delta)
{
	if (this.habitable)
	{
		// maximum amount of births
		var births = ((this.population / 1000) * this.birth_rate) / 12;
		var deaths = ((this.population / 1000) * this.mortality_rate) / 12;

		// handle food and starvation
		if (this.food >= this.population)
		{
			// feed all the people
			this.food -= this.population;
			this.starvation = false;
		}
		else
		{
			// calculate starved
			var starved = this.population - this.food;
			this.food = 0;

			// 1/4 of the unfed population die from starvation each tick
			deaths += (starved / 4) * delta;

			this.starvation = true;
		}

		var tax_effect = 100 - this.tax * 2;
		var growth = (births * (tax_effect / 100)) - deaths;

		var old_population = this.population;

		this.growth_exact = growth * delta;
		this.population += growth * delta;

		// pupulation cannot go below 100
		this.population = this.population < 100 ? 100 : this.population;

		this.growth = tax_effect; // (this.population - this.population) / 100;
	}
}

module.exports.planet = Planet;
