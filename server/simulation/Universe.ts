import Planet from "./Planet"
import Ship from "./Ship"
import Platoon from "./Platoon"
import {
  StarDate,
  PlanetType,
  IUniverse,
  IPlanetBasic,
  IPlanet,
  IPlanetResources,
  IShipBasic,
  IShip,
  IPlatoonBasic,
  IPlatoon,
  Difficulty,
  PlayerGameAction,
  PlanetID,
  PlatoonID,
  ShipID,
  PlatoonStatus,
  IShipTerraformer,
} from "./types"
import { IStaticShipDetails } from "./staticTypes"
import type { IWorld } from "../serverTypes"
import { calculateEspionageMissionCost, generateMissionReport } from "./logic/espionage"
import { calculatePlatoonRecruitmentCost, ordinal } from "./logic/platoons"
import { UniverseEvent, load as loadUniverseEvents } from "./logic/UniverseEvents"
import ShipData from "./data/ships.json"
import EquipmentData from "./data/equipment.json"
import EspionageData from "./data/espionage.json"
import { random } from "./utilities"

const MAXIMUM_PLAYERS = 2

export default class Universe implements IUniverse, IWorld
{
  date: StarDate
  difficulty: Difficulty
  players: string[]
  planets: Planet[]
  ships: Ship[]
  platoons: Platoon[]
  events: UniverseEvent[]
  finished: boolean
  nextShipId: number
  nextPlatoonId: number

  constructor()
  {
    console.log("Universe:constructor")
    this.date = 1
    this.difficulty = Difficulty.Easy
    this.players = []
    this.planets = []
    this.ships = []
    this.platoons = []
    this.events = loadUniverseEvents(this.date)
    this.finished = false
    this.nextShipId = 0
    this.nextPlatoonId = 0
  }

  generate(seed: number)
  {
    // Initial planets based on difficulty, 8, 16, 32
    for (let i = 0; i < 8; i++)
    {
      this.planets.push(new Planet(i))
    }
  }

  join(player: string, ai: boolean, replacedPlayer?: string)
  {
    let ok = false
    console.assert(this.players.length < MAXIMUM_PLAYERS, `Universe is full!`) // Maximum players
    this.players.push(player)

    if (ai)
    {
      // TODO
    }

    if (!replacedPlayer)
    {
      // New players claim a starbase planet
      // Fist player, starts at the top
      let starbase: Planet | undefined
      if (this.players.length === 1)
      {
        starbase = this.planets[0]
      }
      else if (this.players.length === 2)
      {
        starbase = this.planets[this.planets.length - 1]
      }

      if (starbase)
      {
        starbase.claim(player, "Starbase!", this.date, true)
        console.log(`Player ${player} claimed planet ${starbase.id}`)
        ok = true

        // Testing or difficulty levels?
        // provide a solar and a horticultural to all players
        // For now, one of every ship is provided...
        // Object.keys(ShipData).forEach((key, index, keys) => {
        //   const shipData = ShipData[key as keyof typeof ShipData]
        //   const ship = new Ship(
        //     this.nextShipId++,
        //     shipData.shortName,
        //     shipData,
        //     player,
        //     starbase?.id
        //   )

        //   this.ships.push(ship)
        // })

        // to function how the original game does all 25 platoons (for each player)
        // must be pre-created otherwise the UI would be attempting a name match on
        // what platoon the user wants to interact with and those available.
        // FIXME
        for (let index = 0; index < 25; index++)
        {
          const platoon = new Platoon(this.nextPlatoonId++, ordinal(index + 1), player)
          platoon.location.planet = starbase.id
          this.platoons.push(platoon)
        }

        // For an AI player, initialize a platoon to defend their capital
        if (ai)
        {
          // TODO name matching? Does it matter which platoon this is?
          const platoon = this.platoons.find((p) => p.owner === player /* && p.name === "1st" */)
          if (platoon)
          {
            platoon.troops = 500
            platoon.recruit(starbase.id, 25)
          }
        }
      }
    }
    else
    {
      this.transferOwnership(replacedPlayer, player)
      this.players.push(player)
    }

    console.log(`Player ${player} has joined the Universe`, this.players.length)
    return ok
  }

  leave(player: string)
  {
    const index = this.players.indexOf(player)
    if (index !== -1)
    {
      this.players.splice(index, 1)
      console.log(`Player ${player} has left the Universe`, this.players.length)
    }
  }

  toJSON()
  {
    return this
  }

  getStaticData()
  {
    return {
      ships: ShipData,
      equipment: EquipmentData,
    }
  }

  load(data: Universe)
  {
    Object.assign(this, data)

    this.planets = data.planets.map((planet) => {
      return Planet.load(planet)
    })
  }

  transferOwnership(fromPlayerID: string, toPlayerID: string)
  {
    this.planets.forEach((planet) => {
      if (planet.owner === fromPlayerID)
      {
        planet.owner = toPlayerID
      }

      // Transfer aggression settings
      const aggression = planet.playerAggression[fromPlayerID]
      delete planet.playerAggression[fromPlayerID]
      if (aggression)
      {
        planet.playerAggression[toPlayerID] = aggression
      }
    })
    this.ships.forEach((ship) => {
      if (ship.owner === fromPlayerID)
      {
        ship.owner = toPlayerID
      }
    })
    this.platoons.forEach((platoon) => {
      if (platoon.owner === fromPlayerID)
      {
        platoon.owner = toPlayerID
      }
    })

    console.log(`Transferred items from '${fromPlayerID}' to '${toPlayerID}'`)
  }

  dispatch(action: string, player: string, data: object): { result: boolean, reason: string, data: object }
  {
    let result = false
    let reason = ""
    let resultData = {}

    console.log(`Handle ${action} from ${player}`)

    const findPlanetIndex = (id: PlanetID): number => this.planets.findIndex((p) => p.id === id)
    const findPlanet = (id: PlanetID): Planet | undefined => {
      const index = findPlanetIndex(id)
      return index >= 0 ? this.planets[index] : undefined
    }
    const findShipIndex = (id: ShipID): number => this.ships.findIndex((s) => s.id === id)
    const findShip = (id: ShipID): Ship | undefined => {
      const index = findShipIndex(id)
      return index >= 0 ? this.ships[index] : undefined
    }
    const findPlatoonIndex = (id: PlatoonID): number => this.platoons.findIndex((p) => p.id === id)
    const findPlatoon = (id: PlatoonID): Platoon | undefined => {
      const index = findPlatoonIndex(id)
      return index >= 0 ? this.platoons[index] : undefined
    }

    const beginTravel = (ship: Ship, origin: Planet, destination: Planet) => {
      let ok = false
      const distance = Math.abs(origin.location - destination.location)
      const requiredFuels = ship.capacity.fuels > 0 ? 50 * distance : 0
      console.debug(`Distance from ${origin.location} to ${origin.location} is ${distance} and required ${requiredFuels} fuel`)
      if (ship.fuels >= requiredFuels)
      {
        const departed = this.date
        const arrival = this.date + distance

        ship.task = "traveling"
        ship.location.planet = undefined
        ship.location.position = "outer-space"
        ship.heading = {
          location: 0,
          from: origin.id,
          to: destination.id,
          departed,
          arrival,
          fuels: requiredFuels,
        }

        ok = true
      }

      return ok
    }

    const beginHarvesting = (ship: Ship) => {
      ship.task = "harvesting"
      ship.harvester!.cooldown = ship.harvester!.rate
      ship.equipment = {
        multiplier: 1,
        start: this.date
      }
    }

    const cancelHarvesting = (ship: Ship) => {
      ship.task = "idle"
      ship.equipment = undefined
    }

    const toggleHarvesting = (ship: Ship) => {
      if (ship.task === "idle")
      {
        beginHarvesting(ship)
      }
      else
      {
        cancelHarvesting(ship)
      }
    }

    switch (action as PlayerGameAction)
    {
      case "rename-planet":
      {
        const body = data as { planet: number, name: string }

        if (body.planet !== undefined && body.name)
        {
          const planet = this.planets.find((p) => p.id === body.planet)
          if (planet)
          {
            if (planet.owner === player)
            {
              planet.name = body.name
              result = true
              resultData = { world: { planets: [planet.toJSON()] } }
            }
            else
            {
              reason = "Incorrect planet owner"
            }
          }
          else
          {
            reason = "Invalid planet"
          }
        }
        else
        {
          reason = "Action data missing planet or name"
        }
        break
      }
      case "planet-modify-tax":
      {
        const body = data as { planet: number, value: number }
        if (body.planet !== undefined && body.value)
        {
          const planet = this.planets.find((p) => p.id === body.planet)
          if (planet)
          {
            if (planet.owner === player)
            {
              planet.tax += body.value
              if (planet.tax < 0)
              {
                planet.tax = 0
              }
              else if (planet.tax > 100)
              {
                planet.tax = 100
              }

              result = true
              resultData = { world: { planets: [planet.toJSON()] } }
            }
            else
            {
              reason = "Incorrect planet owner"
            }
          }
          else
          {
            reason = "Failed to find planet"
          }
        }
        else
        {
          reason = "Action data missing"
        }
      }
      case "planet-terraform":
      {
        const body = data as { id: PlanetID }
        if (body.id !== undefined)
        {
          const planet = findPlanet(body.id)
          if (planet)
          {
            if (planet.type === PlanetType.Lifeless)
            {
              const atmos = this.ships.find((s) => s.owner === player && s.type === "Atmosphere Processor")
              if (atmos)
              {
                const currentPlanet = findPlanet(atmos.location.planet!) as Planet

                // Move the atmos to the planet, begin terraforming once it arrives
                if (atmos.location.position !== "orbit")
                {
                  atmos.relocate("orbit")
                }

                // assume it can always travel
                if (atmos.canTravel(currentPlanet, planet))
                {
                  if (beginTravel(atmos, currentPlanet, planet))
                  {
                    resultData = { world: { ships: [atmos.toJSON()] } }
                    result = true
                  }
                  else
                  {
                    reason = "Failed to begin travel"
                  }
                }
              }
              else
              {
                reason = "Failed to find player Atmos"
              }
            }
            else
            {
              reason = "Failed to relocate ship"
            }
          }
          else
          {
            reason = "Invalid planet ID"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "planet-espionage":
      {
        const body = data as { id: PlanetID, mission: string }
        if (body.id !== undefined && body.mission)
        {
          const planet = findPlanet(body.id)
          if (planet)
          {
            if (planet.habitable && planet.owner !== player)
            {
              const capital = this.planets.find((p) => p.capital === true && p.owner === player)
              if (capital)
              {
                const cost = calculateEspionageMissionCost(body.mission)
                if (capital.resources.credits >= cost)
                {
                  const strength = this.platoons.filter((p) => p.location.planet === planet.id).reduce((prev, item) => prev + item.strength, 0)

                  capital.resources.credits -= cost
                  const report = generateMissionReport(planet, strength, body.mission)
                  report.date = this.date

                  resultData = { world: { planets: [capital.toJSON()], espionage: report } }
                  result = true
                }
                else
                {
                  reason = "Cannot afford espionage mission"
                }
              }
              else
              {
                reason = "Failed to find capital planet of player"
              }
            }
            else
            {
              reason = "Cannot perform Espionage on planet"
            }
          }
          else
          {
            reason = "Invalid planet ID"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "planet-modify-aggression":
      {
        const body = data as { id: string, direction: number }
        if (body.id !== undefined && body.direction)
        {

        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "transfer-credits":
      {
        const body = data as { planet: number }
        if (body.planet !== undefined)
        {
          const sourcePlanet = this.planets.find((p) => p.id === body.planet)

          if (sourcePlanet && sourcePlanet.owner === player)
          {
            if (sourcePlanet.capital === false)
            {
              const capital = this.planets.find((p) => p.capital === true && p.owner === player)
              if (capital)
              {
                capital.resources.credits += sourcePlanet.resources.credits
                sourcePlanet.resources.credits = 0
                result = true
                resultData = { world: { planets: [sourcePlanet.toJSON()] } }
              }
              else
              {
                reason = "Failed to capital for player"
              }
            }
            else
            {
              reason = "Cannot transfer credits from Capital"
            }
          }
          else
          {
            reason = "Invalid planet"
          }
        }
        else
        {
          reason = "Action data missing planet"
        }
        break
      }
      case "ship-purchase":
      {
        const body = data as { id: string, name: string }
        if (body.id)
        {
          const capital = this.planets.find((p) => p.owner === player && p.capital === true)
          if (capital)
          {
            const staticData = this.getStaticData()
            const ship = staticData.ships[body.id as keyof typeof staticData.ships] as IStaticShipDetails
            if (ship)
            {
              const cost = {
                credits: 0,
                minerals: 0,
                energy: 0,
              }

              switch (this.difficulty)
              {
                case Difficulty.Impossible:
                case Difficulty.Hard:
                {
                  cost.credits = ship.cost.credits
                  cost.minerals = ship.cost.minerals
                  cost.energy = ship.cost.energy
                  break
                }
                case Difficulty.Medium:
                {
                  cost.credits = ship.cost.credits
                  cost.minerals = ship.cost.minerals
                  break
                }
                case Difficulty.Easy:
                {
                  cost.credits = ship.cost.credits
                  break
                }
              }

              if (ship.type === "Atmosphere Processor" && false === this.events.find((e) => e.id === "terraforming-breakthrough")!.completed)
              {
                reason = "Atmosphere Processor is not yet available"
              }
              else if (ship.limit !== undefined && this.ships.filter((s) => s.type === ship.type).length >= ship.limit)
              {
                reason = "Reached limit for ship"
              }
              else if (capital.resources.credits >= cost.credits
                && capital.resources.minerals >= cost.minerals
                && capital.resources.energy >= cost.energy)
              {
                capital.resources.credits -= cost.credits
                capital.resources.minerals -= cost.minerals
                capital.resources.energy -= cost.energy

                const newShip = new Ship(this.nextShipId++, body.name, ship, player, capital.id)
                this.ships.push(newShip)

                result = true
                resultData = { world: { planets: [capital.toJSON()], ships: [newShip.toJSON()] } }
              }
              else
              {
                reason = "Cannot afford ship"
              }
            }
          }
          else
          {
            reason = "Failed to find player capital"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "ship-rename":
      {
        const body = data as { id: ShipID, name: string }
        if (body.id !== undefined)
        {
          const ship = findShip(body.id)
          if (ship)
          {
            if (body.name)
            {
              ship.name = body.name

              resultData = { world: { ships: [ship.toJSON()] } }
              result = true
            }
            else
            {
              reason = "Invalid name"
            }
          }
          else
          {
            reason = "Invalid ship ID"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "ship-modify-cargo":
      {
        const body = data as { id: ShipID, type: string, amount: number }
        if (body.id !== undefined)
        {
          const ship = findShip(body.id)
          if (ship)
          {
            if (ship.location.position === "docking-bay")
            {
              const planet = findPlanet(ship.location.planet!) as Planet
              ship.modifyCargo(planet, body.type, body.amount)

              resultData = { world: { planets: [planet.toJSON()], ships: [ship.toJSON()] } }
              result = true
            }
            else
            {
              reason = "Ship is not in planet docking bay"
            }
          }
          else
          {
            reason = "Invalid ship ID"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "ship-modify-passengers":
      {
        const body = data as { id: ShipID, amount: number }
        if (body.id !== undefined)
        {
          const ship = findShip(body.id)
          if (ship)
          {
            if (ship.location.position === "docking-bay")
            {
              const planet = findPlanet(ship.location.planet!) as Planet
              ship.modifyPassengers(planet, body.amount)

              resultData = { world: { planets: [planet.toJSON()], ships: [ship.toJSON()] } }
              result = true
            }
            else
            {
              reason = "Ship is not in planet docking bay"
            }
          }
          else
          {
            reason = "Invalid ship ID"
          }
        }
        else
        {
          reason = "Invalid ship ID"
        }
        break
      }
      case "ship-modify-fuels":
      {
        const body = data as { id: ShipID, amount: number }
        if (body.id !== undefined)
        {
          const ship = findShip(body.id)
          if (ship)
          {
            if (ship.location.position === "docking-bay")
            {
              const planet = findPlanet(ship.location.planet!) as Planet
              ship.refuel(planet, body.amount)

              resultData = { world: { planets: [planet.toJSON()], ships: [ship.toJSON()] } }
              result = true
            }
            else
            {
              reason = "Ship is not in planet docking bay"
            }
          }
          else
          {
            reason = "Invalid ship ID"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "ship-add-crew":
      {
        const body = data as { id: ShipID }
        if (body.id !== undefined)
        {
          const ship = findShip(body.id)
          if (ship)
          {
            if (ship.location.position === "docking-bay")
            {
              const planet = findPlanet(ship.location.planet!) as Planet
              ship.addCrew(planet)

              if (ship.crew === ship.requiredCrew)
              {
                resultData = { world: { planets: [planet.toJSON()], ships: [ship.toJSON()] } }
                result = true
              }
              else
              {
                reason = "Failed to add crew"
              }
            }
            else
            {
              reason = "Ship is not in planet docking bay"
            }
          }
          else
          {
            reason = "Invalid ship ID"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "ship-empty-cargo":
      {
        const body = data as { id: ShipID }
        if (body.id !== undefined)
        {
          const ship = findShip(body.id)
          if (ship)
          {
            if (ship.location.position === "docking-bay")
            {
              const planet = findPlanet(ship.location.planet!) as Planet
              ship.emptyCargo(planet)

              resultData = { world: { planets: [planet.toJSON()], ships: [ship.toJSON()] } }
              result = true
            }
            else
            {
              reason = "Ship is not in planet docking bay"
            }
          }
          else
          {
            reason = "Invalid ship ID"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "ship-relocate":
      {
        const body = data as { id: ShipID, position: string }
        if (body.id !== undefined && body.position)
        {
          const ship = findShip(body.id)
          if (ship)
          {
            if (ship.relocate(body.position))
            {
              // If the ship type is a solar; immediately begin harvesting evergy
              if (ship.harvester && ship.location.position === "orbit")
              {
                beginHarvesting(ship)
              }
              else
              {
                cancelHarvesting(ship)
              }

              resultData = { world: { ships: [ship.toJSON()] } }
              result = true
            }
            else
            {
              reason = "Failed to relocate ship"
            }
          }
          else
          {
            reason = "Invalid ship ID"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "ship-travel":
      {
        const body = data as { id: ShipID, location: PlanetID }
        if (body.id !== undefined && body.location !== undefined)
        {
          const ship = findShip(body.id)
          if (ship && ship.location.planet !== undefined)
          {
            const currentPlanet = findPlanet(ship.location.planet)
            const destinationPlanet = findPlanet(body.location)
            if (currentPlanet && destinationPlanet)
            {
              if (ship.canTravel(currentPlanet, destinationPlanet))
              {
                if (beginTravel(ship, currentPlanet, destinationPlanet))
                {
                  resultData = { world: { ships: [ship.toJSON()] } }
                  result = true
                }
                else
                {
                  reason = "Ship does not have enough fuel"
                }
              }
              else
              {
                reason = "Failed to begin travel"
              }
            }
            else
            {
              reason = "Failed to find current or destination planet"
            }
          }
          else
          {
            reason = "Invalid ship ID"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "ship-toggle-surface-status":
      {
        const body = data as { id: ShipID }
        if (body.id !== undefined)
        {
          const ship = findShip(body.id)
          if (ship)
          {
            if (ship.harvester !== undefined)
            {
              if (ship.location.position === "surface")
              {
                if (ship.crew > 0)
                {
                  toggleHarvesting(ship)

                  resultData = { world: { ships: [ship.toJSON()] } }
                  result = true
                }
                else
                {
                  reason = "Ship does not have any crew"
                }
              }
              else
              {
                reason = "Ship is in an incorrect position"
              }
            }
            else
            {
              reason = "Ship is unable to harvest"
            }
          }
          else
          {
            reason = "Invalid ship ID"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "ship-decommission":
      {
        const body = data as { id: number }
        if (body.id !== undefined)
        {
          const index = findShipIndex(body.id)
          if (index >= 0)
          {
            const ship = this.ships[index] as Ship
            if (ship.location.position === "docking-bay")
            {
              const planet = findPlanet(ship.location.planet!) as Planet
              // Can only decommission a ship on a friendly planet
              if (planet.owner === ship.owner)
              {
                const capital = this.planets.find((p) => p.owner === player && p.capital === true) as Planet
                console.assert(capital, "Failed to find player capital")

                // Remove crew, passengers, fuel and cargo
                ship.removeCrew(planet)
                ship.modifyPassengers(planet, -ship.passengers)
                ship.refuel(planet, -ship.fuels)
                ship.emptyCargo(planet)

                capital.resources.credits += ship.value
                // ship.status = "decommissioned"
                this.ships.splice(index, 1)

                resultData = { world: { planets: [capital.toJSON()] } }
                result = true
              }
              else
              {
                reason = "Ship is not on a friendly planet"
              }
            }
            else
            {
              reason = "Ship is not in planet docking bay"
            }
          }
          else
          {
            reason = "Invalid ship ID"
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "platoon-modify":
      {
        const body = data as { id: PlatoonID, amount?: number, suit?: string, weapon?: string }
        if (body.id !== undefined)
        {
          const platoon = this.platoons.find((p) => p.id === body.id)
          if (!platoon)
          {
            reason = "Invalid platoon"
          }
          else if (platoon.owner !== player)
          {
            console.log(body.id, platoon.id, platoon.owner, player)
            reason = "Incorrect platoon owner"
          }
          else
          {
            const capital = this.planets.find((p) => p.capital === true && p.owner === player)

            if (!capital)
            {
              reason = "Failed to find player capital planet"
            }
            else
            {
              if (body.amount !== undefined)
              {
                const populationChange = -body.amount

                if (populationChange > 0 && capital.population < populationChange)
                {
                  reason = "Insufficient available civilians on planet"
                }
                else
                {
                  capital.population += populationChange
                  platoon.modifyTroops(body.amount)
                }
              }

              if (body.suit)
              {
                platoon.suit = body.suit
              }

              if (body.weapon)
              {
                platoon.weapon = body.weapon
              }

              result = true
              resultData = { world: { planets: [capital.toJSON()], platoons: [platoon.toJSON()] } }
            }
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "platoon-recruit":
      {
        const body = data as { id: PlatoonID }
        if (body.id !== undefined)
        {
          const platoon = this.platoons.find((p) => p.id === body.id)
          if (!platoon)
          {
            reason = "Invalid platoon"
          }
          else if (platoon.owner !== player)
          {
            reason = "Incorrect platoon owner"
          }
          else
          {
            const capital = this.planets.find((p) => p.capital === true && p.owner === player)
            if (!capital)
            {
              reason = "Failed to find player capital"
            }
            else
            {
              const cost = calculatePlatoonRecruitmentCost(platoon)
              if (capital.resources.credits < cost)
              {
                reason = "Cannot afford platoon equipment"
              }
              else
              {
                capital.resources.credits -= cost

                platoon.recruit(capital.id, capital.getPlayerAggression(player));

                result = true
                resultData = { world: { planets: [capital.toJSON()], platoons: [platoon.toJSON()] } }
              }
            }
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "platoon-dismiss":
      {
        const body = data as { id: PlatoonID }
        if (body.id !== undefined)
        {
          const platoon = findPlatoon(body.id)
          if (!platoon)
          {
            reason = "Invalid platoon"
          }
          else if (platoon.location.planet === undefined)
          {
            reason = "Not located on planet"
          }
          else
          {
            const planet = findPlanet(platoon.location.planet)
            if (planet)
            {
              planet.population += platoon.troops
              platoon.dismiss()

              result = true
              resultData = { world: { planets: [planet.toJSON()], platoons: [platoon.toJSON()] } }
            }
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "platoon-relocate":
      {
        const body = data as { id: PlatoonID, direction: string, ship: ShipID }
        if (body.id !== undefined && body.ship !== undefined)
        {
          const platoon = findPlatoon(body.id)
          const ship = findShip(body.ship)

          if (!platoon || platoon.owner !== player || platoon.status !== PlatoonStatus.Recruited)
          {
            reason = "Invalid platoon"
          }
          else if (!ship || ship.owner !== player || ship.capacity.platoons === 0)
          {
            reason = "Invalid ship"
          }
          else
          {
            if (body.direction === "load")
            {
              const onboard = this.platoons.filter((p) => p.location.ship === ship.id)
              if (onboard.length === ship.capacity.platoons)
              {
                reason = "Ship is full"
              }
              else
              {
                platoon.location.ship = ship.id
                platoon.location.planet = undefined

                result = true
                resultData = { world: { platoons: [platoon.toJSON()] } }
              }
            }
            if (body.direction === "unload")
            {
              if (platoon.location.ship !== ship.id)
              {
                reason = "Platoon is not onboard ship"
              }
              else
              {
                platoon.location.ship = undefined
                platoon.location.planet = ship.location.planet

                result = true
                resultData = { world: { platoons: [platoon.toJSON()] } }
              }
            }
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      default:
      {
        console.warn(`Unhandled action ${action}`)
        break
      }
    }

    console.log(`Action completed '${result}': ${reason}`)
    return { result, reason, data: resultData }
  }

  simulate(delta: number): void
  {
    // console.log("Universe:tick")
    this.date += delta

    this.events.forEach((event) => {
      if (false === event.completed && this.date > event.when!)
      {
        event.lastOccurred = this.date

        this.handleEvent(event)

        if (event.repeat)
        {
          event.setNextDate(this.date)
          console.log(`Event '${event.name}' will occur again on ${event.when}`)
        }
        else
        {
          event.completed = true
        }
      }
    })

    this.planets.forEach((planet) => {
      if (planet.simulate(delta, this.date))
      {
        // changes.planets.push(planet.id)
      }
    })

    // identify multipliers based on events and research
    const multipliers = {
      food: 1,
      minerals: 1,
      fuels: 1,
      energy: 1,
    }

    this.events.find((e) => {
      switch (e.type)
      {
        case "horticultural-breakthrough":
        {
          multipliers.food = 2
          break
        }
        default:
        {
          break
        }
      }
    })

    const calculateResourceChange = (base: number, multiplier: number) => ((base * multiplier) / 2)

    this.ships.forEach((ship) => {
      if (ship.task === "harvesting" && ship.harvester)
      {
        // TODO do energy first so all ships that can harvest, do.
        const planet = this.planets.find((p) => p.id === ship.location.planet)
        if (planet)
        {
          const harvester = ship.harvester

          harvester.cooldown -= delta

          if (harvester.cooldown < 0)
          {
            harvester.cooldown = harvester.rate

            // Generate energy or use energy
            if (harvester.resources.energy < 0)
            {
              if (planet.resources.energy > harvester.resources.energy)
              {
                // Immediately take the required energy
                planet.resources.energy += harvester.resources.energy
                planet.resources.food += calculateResourceChange(harvester.resources.food, multipliers.food)
                planet.resources.minerals += calculateResourceChange(harvester.resources.minerals, multipliers.minerals)
                planet.resources.fuels += calculateResourceChange(harvester.resources.fuels, multipliers.fuels)
              }
              else
              {
                ship.task = "idle"
              }
            }
            else
            {
              planet.resources.energy += calculateResourceChange(harvester.resources.energy, multipliers.energy)
            }
          }
        }
      }
      else if (ship.task === "traveling")
      {
        if (ship.heading)
        {
          if (this.date > ship.heading.arrival)
          {
            ship.location.planet = ship.heading.to
            ship.location.position = "orbit"
            ship.task = "idle"
            ship.heading = undefined

            const planet = this.planets.find((p) => p.id === ship.location.planet) as Planet
            console.log(`Ship ${ship.name} (${ship.id}) has arrived at ${planet.name} (${planet.id})`)

            if (ship.type === "Atmosphere Processor" && planet.type === PlanetType.Lifeless && planet.terraforming === false)
            {
              const endDate: StarDate = this.date + planet.terraformDuration
              ship.location.position = "surface"
              ship.equipment = {
                start: this.date,
                end: endDate,
                planetName: "new planet",
              }
              ship.task = "terraforming"

              planet.terraforming = true
              console.log(`Begin terrforming planet ${planet.name}, will complete ${endDate}`)
            }
          }
        }
        else
        {
          ship.task = "idle"
        }
      }
      else if (ship.task === "terraforming")
      {
        const terraformer = ship.equipment as IShipTerraformer
        if (this.date > terraformer.end)
        {
          ship.task = "idle"
          ship.equipment = undefined

          const planet = this.planets.find((p) => p.id === ship.location.planet) as Planet
          planet.claim(ship.owner, terraformer.planetName, this.date, false)
          console.log(`Completed terraforming planet ${planet.name} (${planet.id}) by ${ship.owner}`)
        }
      }
    })

    this.platoons.forEach((platoon) => {
      if (platoon.status === PlatoonStatus.Training)
      {
        platoon.train(delta)
      }
    })
  }

  handleEvent(event: UniverseEvent)
  {

  }

  updateFor(player: string): IUniverse
  {
    const universe: IUniverse = {
      // Don't send partial days
      date: this.date,
      difficulty: this.difficulty,
      planets: [],
      ships: [],
      platoons: [],
    }

    this.planets.forEach((planet) => {
      let planetData: IPlanetBasic | IPlanet = {
        id: planet.id,
        type: planet.type,
        owner: planet.owner,
        name: "",
        aggression: 0,
        radius: planet.radius,
        location: planet.location,
        terraforming: planet.terraforming,
      }

      if (planet.type === PlanetType.Lifeless)
      {
        // No additional data
        planetData.name = "Lifeless"
      }
      else if (planet.owner === player)
      {
        // Send all data
        planetData = {
          ...planet,
          aggression: planet.getPlayerAggression(player)
        }
      }
      else
      {
        // Send limited data
        planetData.name = "Classified"
        planetData.aggression = planet.getPlayerAggression(player)
      }

      universe.planets.push(planetData)
    })

    this.ships.forEach((ship) => {
      let shipData: IShipBasic | IShip | undefined

      if (ship.owner === player)
      {
        // Send all data...
        shipData = {
          ...ship
        }
      }
      else
      {
        // Only send ship data if it's located at the players planets
        if (ship.location.planet !== undefined)
        {
          const planet = this.planets.find((p) => p.id === ship.location.planet)
          if (planet && planet.owner === player)
          {
            shipData = {
              id: ship.id,
              type: ship.type,
              name: ship.name,
              owner: ship.owner,
              location: { ...ship.location },
            }
          }
        }
      }

      if (shipData)
      {
        universe.ships.push(shipData)
      }
    })

    this.platoons.forEach((platoon) => {
      let platoonData: IPlatoonBasic | IPlatoon | undefined

      if (platoon.owner === player)
      {
        // Send all data
        platoonData = {
          ...platoon,
          strength: platoon.strength,
          rank: platoon.rank,
        }
      }
      else
      {
        if (platoon.location.planet !== undefined)
        {
          const planet = this.planets.find((p) => p.id === platoon.location.planet)
          if (planet && planet.owner === player)
          {
            platoonData = {
              id: platoon.id,
              name: platoon.name,
              owner: platoon.owner,
              location: { ...platoon.location },
              status: platoon.status,
              strength: platoon.strength,
            }
          }
        }
      }

      if (platoonData)
      {
        universe.platoons.push(platoonData)
      }
    })

    return universe
  }
}
