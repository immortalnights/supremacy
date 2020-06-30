
function Ship()
{
	this.name = "";
	this.type = "";
	// required crew
	this.crew = 0;
	// maximum capacity for civilians
	this.seats = 0;
	// maximum cargo capacity
	this.capacity = 0;
	// maximum fuel
	this.fuel_capacity = 0;
	this.cost = 0;
	this.platoon_space = 0;
	this.harvester = {
		// required location for harvesting
		location: "",
		// energy cost to operate the ship
		cost: 0,

		// resource income when in the correct location
		food: 0,
		minerals: 0,
		fuel: 0,
		energy: 0
	};

	// location of the ship (null is traveling)
	// location type (traveling, in orbit, docked, on surface)
	this.location = { planet: null, type: "" };


	this.target = { planet: null, distance: 0 };

	this.crewed = false;
	this.civilians = 0;
	this.fuel = 0;
	this.cargo = { food: 0, minerals: 0, fuel: 0, energy: 0 };
	this.platoons = [];
}

Ship.prototype.initialize = function(name, ship_template)
{
	this.name = name;
	this.type = ship_template.type;

	this.speed = ship_template.speed;
	this.crew = ship_template.crew;
	this.seats = ship_template.seats;
	this.capacity = ship_template.capacity;
	this.fuel_capacity = ship_template.fuel_capacity;
	this.cost = ship_template.cost;
	this.platoon_space = ship_template.platoon_space;

	this.harvester = ship_template.harvester;

	this.location = { planet: null, type: "" };

	console.log(this, this.harvester, this.harvester.location);
}

//! send the ship to a different planet
Ship.prototype.travelTo = function(target_planet, distance)
{
	//! ship can only move away from a planet when in orbit
	if (this.location.planet && this.location.type == "orbit")
	{
		this.location = { planet: null, type: "traveling" };

		this.target = { planet: target_planet, distance: distance };
	}
}

//! change the ships location for the specified planet
Ship.prototype.changeLocation = function(planet, location_type)
{
	if (!this.location.planet)
	{
		if ("orbit" != location_type && "docked" != location_type)
		{
			console.log("Invalid arrival location", location_type);
		}

		this.location = { planet: planet, type: "orbit" };
	}
	else
	{
		var valid_transition = false;
		// validate the transition
		switch (this.location.type)
		{
			case "surface":
			{
				valid_transition = (location_type == "docked");
				break;
			}
			case "docked":
			{
				valid_transition = (location_type == "surface" || location_type == "orbit");
				break;
			}
			case "orbit":
			{
				valid_transition = (location_type == "docked");
				break;
			}
			default:
			{
				console.log("Ship is in invalid location!");
			}
		}

		if (!valid_transition)
		{
			console.log("Cannot move ship from", this.location.type, "to", location_type);
		}
		else
		{
			// move the ship out of the current location
			switch (this.location.type)
			{
				case "surface":
				{
					this.location.planet.launch(this);
					break;
				}
				case "docked":
				{
					this.location.planet.undock(this);
					break;
				}
				case "orbit":
				{
					this.location.planet.breakOrbit(this);
					break;
				}
			}

			// and put it in the new location
			this.location = { planet: planet, type: location_type };
		}
	}
}

Ship.prototype.harvest = function(location, planet)
{
	if (location == this.harvester.location)
	{
		if (planet.energy >= this.harvester.cost)
		{
			planet.energy -= this.harvester.cost;

			planet.food     += this.harvester.food;
			planet.energy   += this.harvester.energy;
			planet.minerals += this.harvester.minerals;
		}
	}
}

Ship.prototype.update = function(delta)
{
	// null location means the ship is in transit
	if (null == this.location.planet)
	{
		this.target.distance -= (this.speed / delta);
		
		// check arrival
		if (0 > this.target.distance)
		{
			changeLocation(this.target.planet, "orbit");
			this.target = { planet: null, distance: 0 };
		}
	}
	else
	{

	}
};

module.exports.ship = Ship;
module.exports.templates = require('../data/ships.json');
