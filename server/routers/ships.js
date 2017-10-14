const debug = require('debug')('server');
const Core = require('./core');
const _ = require('underscore');

const formatLocationSumamry = function(shipName, planetName, position) {
	var result = "";
	switch (position)
	{
		case 'dock':
		{
			result = shipName + " is in a docking bay on " + planetName;
			break;
		}
		case 'orbit':
		{
			result = shipName + " is now in orbit above " + planetName;
			break;
		}
		case 'transit':
		{
			result = shipName + " is now in transit to " + planetName;
			break;
		}
		case 'surface':
		{
			result = shipName + " is on the surface of " + planetName;
			break;
		}
	}
	return result;
}

const updateShipLocationSummary = function(ship, planets) {
	var location = ship.get('location');

	var planet = planets.get(location.planet);
	console.assert(planet);
	location.summary = formatLocationSumamry(ship.get('name'), planet.get('name'), location.position);
}

/**
 * Handles Ships related API routes
 */
module.exports = class ShipContoller extends Core {
	constructor(router)
	{
		super(router);

		this.register.get('/ships',                     this.onGetShips);
		this.register.get('/ships/:id',                 this.onGetShip);
		this.register.delete('/ships/:id',              this.onDeleteShip);
		this.register.put('/ships/build/invoke',        this.onBuild);
		this.register.put('/ships/:id/launch/invoke',   this.onLaunchShip);
		this.register.put('/ships/:id/dock/invoke',     this.onDockShip);
		this.register.put('/ships/:id/land/invoke',     this.onLandShip);
		this.register.put('/ships/:id/transfer/invoke', this.onTransferShip);
		this.register.put('/ships/:id/crew/invoke',     this.onCrewShip);
		this.register.put('/ships/:id/load/invoke',     this.onLoadShip);
		this.register.put('/ships/:id/unload/invoke',   this.onUnloadShip);
	}

	onGetShips(request, response, server)
	{
		console.assert(server);
		// TODO apply location summary here and respond with list
		this.onGetList(server.game.ships, request, response);
	}

	onGetShip(request, response, server)
	{
		console.assert(server);
		// TODO apply location summary here and respond with list
		this.onGetSingle(server.game.ships, request, response);
	}

	onBuild(request, response, server)
	{
		// TODO
	}

	onLaunchShip(request, response, server)
	{
		this.performShipAction('launch', request, response, server);
	}

	onDockShip(request, response, server)
	{
		this.performShipAction('dock', request, response, server);
	}

	onLandShip(request, response, server)
	{
		this.performShipAction('land', request, response, server);
	}

	onTransferShip(request, response, server)
	{
		console.assert(server);

		const playerId = request.cookies.playerId;
		let ship = server.game.ships.get(request.params.id);

		try
		{
			if (!ship || ship.owner.id !== playerId)
			{
				this.writeResponse(response, 404, "Failed to find ship '" + request.params.id + "'.");
			}
			else
			{
				let location = ship.get('location');
				if (location.position !== 'orbit')
				{
					this.writeResponse(response, 400, "Ship is not in orbit.");
				}
				else
				{
					let planet = server.game.planets.get(request.body.planet);

					if (!planet)
					{
						this.writeResponse(response, 404, "Failed to find planet '" + request.body.planet + "'.");
					}
					else if (location.planet === planet.id)
					{
						this.writeResponse(response, 400, "Ship is already there.");
					}
					else
					{
						// calculate fuel
						let details = server.game.getTravelDetails(location.planet, planet.id);

						if (ship.get('fuel') !== 'nuclear' && details.fuel > ship.get('fuel'))
						{
							this.writeResponse(response, 400, "Ship does not have enough fuel (required " + details.fuel + "T).");
						}
						else
						{
							ship.set({
								location: {
									planet: null,
									position: null
								},
								travel: {
									planet: planet.id,
									eta: details.eta
								}
							});

							this.writeResponse(response, 200, ship);
						}
					}
				}
			}
		}
		catch (err)
		{
			this.writeResponse(response, 500, err);
		}
	}

	onCrewShip(request, response, server)
	{
		console.assert(server);

		const playerId = request.cookies.playerId;
		let ship = server.game.ships.get(request.params.id);

		try
		{
			if (!ship || ship.owner.id !== playerId)
			{
				this.writeResponse(response, 404, "Failed to find ship '" + request.params.id + "'.");
			}
			else
			{
				const location = ship.get('location');
				const crew = ship.get('crew');
				const requiredCrew = ship.get('requiredCrew');

				if (requiredCrew === 0)
				{
					this.writeResponse(response, 400, "Crew is not required.");
				}
				else if (crew === requiredCrew)
				{
					this.writeResponse(response, 400, "Ship already has crew.");
				}
				else if (!location.planet || location.position !== 'dock')
				{
					this.writeResponse(response, 400, "Ship is not docked.");
				}
				else
				{
					let planet = server.game.planets.get(location.planet);

					if (!planet)
					{
						this.writeResponse(response, 404, "Failed to find planet where ship is docked.");
					}
					else
					{
						const population = planet.get('population');

						if (population < requiredCrew)
						{
							this.writeResponse(response, 400, "Planet does not have enough free population.");
						}
						else
						{
							planet.set('population', population - requiredCrew);
							ship.set('crew', requiredCrew);

							this.writeResponse(response, 200, ship);
						}
					}
				}
			}
		}
		catch (err)
		{
			this.writeResponse(response, 500, err);
		}
	}

	onLoadShip(request, response, server)
	{
		console.assert(server);

		const playerId = request.cookies.playerId;
		let ship = server.game.ships.get(request.params.id);

		this.writeResponse(response, 400, "Unsupported");
	}

	onUnloadShip(request, response, server)
	{
		console.assert(server);

		const playerId = request.cookies.playerId;
		let ship = server.game.ships.get(request.params.id);

		this.writeResponse(response, 400, "Unsupported");
	}

	performShipAction(action, request, response, server)
	{
		console.assert(server);

		const playerId = request.cookies.playerId;
		let ship = server.game.ships.get(request.params.id);

		try
		{

			if (!ship)
			{
				throw new Error("Ship '" + request.params.id + "' does not exist.");
			}
			else if (ship.owner.id !== playerId)
			{
				throw new Error("Ship '" + request.params.id + "' does not exist.");
			}
			// Cannot do anything if the ship does not have the required crew
			else if (ship.get('requiredCrew') !== 0 && ship.get('requiredCrew') !== ship.get('crew'))
			{
				throw new Error("Ship '" + request.params.id + "' does not the required crew.");
			}
			else
			{
				const fuel = ship.get('fuel');

				var result;
				switch (action)
				{
					case 'launch':
					{
						if (fuel !== 'nuclear' && fuel < 100)
						{
							throw new Error("Ship '" + request.params.id + "' does not have enough fuel.");
						}
						else
						{
							// Costs 100 fuel to launch (where ship uses fuel)
							if (fuel !== 'nuclear')
							{
								ship.set('fuel', fuel - 100);
							}

							result = ship.moveTo('orbit');
						}
						break;
					}
					case 'land':
					{
						result = ship.moveTo('surface');
						break;
					}
					case 'dock':
					{
						result = ship.moveTo('dock');
						break;
					}
					case 'transfer':
					{
						// result = ship.transferTo()
						// fall through
					}
					default:
					{
						throw new Error("Invalid action '" + request.params.action + "' for ship.");
						break;
					}
				}

				updateShipLocationSummary(ship, server.game.planets);
				this.writeResponse(response, 200, ship);
			}
		}
		catch (err)
		{
			this.writeResponse(response, 400, err);
		}
	}
}
