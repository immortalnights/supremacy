import Planet from "./Planet"
import Ship from "./Ship"
import Platoon from "./Platoon"
import {
  PlanetType,
  IUniverse,
  IPlanetBasic,
  IPlanet,
  IShipBasic,
  IShip,
  IPlatoonBasic,
  IPlatoon,
  IShipDetails,
  DAYS_PER_YEAR,
  IDate,
  Difficulty,
  PlayerGameAction,
  PlatoonID,
} from "./types"
import type { IWorld } from "../serverTypes"
import ShipData from "./data/ships.json"
import EquipmentData from "./data/equipment.json"
import { random } from "./utilities"

const MAXIMUM_PLAYERS = 2

export default class Universe implements IUniverse, IWorld
{
  date: IDate
  // FIXME would be better if this was not a member
  yearDuration: number
  difficulty: Difficulty
  players: string[]
  planets: Planet[]
  ships: Ship[]
  platoons: Platoon[]
  finished: boolean
  nextShipId: number
  nextPlatoonId: number

  constructor()
  {
    console.log("Universe:constructor")
    this.date = { day: 1, year: 3000 }
    this.yearDuration = DAYS_PER_YEAR
    this.difficulty = Difficulty.Easy
    this.players = []
    this.planets = []
    this.ships = []
    this.platoons = [],
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
        starbase.claim(player, "Starbase!", true)
        console.log(`Player ${player} claimed planet ${starbase.id}`)
        ok = true

        // Testing or difficulty levels?
        // provide a solar and a horticultural to all players
        // For now, one of every ship is provided...
        Object.keys(ShipData).forEach((key, index, keys) => {
          const shipData = ShipData[key as keyof typeof ShipData]
          const ship = new Ship(
            this.nextShipId++,
            shipData.shortName,
            shipData,
            player,
            starbase?.id
          )

          this.ships.push(ship)
        })

        // to function how the original game does all 25 platoons (for each player)
        // must be pre-created otherwise the UI would be attempting a name match on
        // what platoon the user wants to interact with and those available.
        // FIXME
        for (let index = 0; index < 25; index++)
        {
          const platoon = new Platoon(this.nextPlatoonId++, `${index + 1}st`, player)
          platoon.troops = 0
          platoon.suit = "suit_1"
          platoon.equipment = "weapon_1"
          platoon.location.planet = starbase.id
          this.platoons.push(platoon)
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
      const p = new Planet(0)
      p.load(planet)

      return p
    })
  }

  transferOwnership(fromPlayerID: string, toPlayerID: string)
  {
    this.planets.forEach((planet) => {
      if (planet.owner === fromPlayerID)
      {
        planet.owner = toPlayerID
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
      case "purchase-ship":
      {
        const body = data as { id: string }
        if (body.id)
        {
          const capital = this.planets.find((p) => p.owner === player && p.capital === true)
          if (capital)
          {
            const staticData = this.getStaticData()
            const ship = staticData.ships[body.id as keyof typeof staticData.ships] as IShipDetails
            if (ship)
            {
              let bought = false
              switch (this.difficulty)
              {
                case Difficulty.Impossible:
                case Difficulty.Hard:
                {
                  if (capital.resources.credits >= ship.cost.credits
                     && capital.resources.minerals >= ship.cost.minerals
                     && capital.resources.energy >= ship.cost.energy)
                  {
                    capital.resources.credits -= ship.cost.credits
                    capital.resources.minerals -= ship.cost.minerals
                    capital.resources.energy -= ship.cost.energy
                    bought = true
                  }
                  break
                }
                case Difficulty.Medium:
                {
                  if (capital.resources.credits >= ship.cost.credits
                    && capital.resources.minerals >= ship.cost.minerals)
                  {
                    capital.resources.credits -= ship.cost.credits
                    capital.resources.minerals -= ship.cost.minerals
                    bought = true
                  }
                  break
                }
                case Difficulty.Easy:
                {
                  if (capital.resources.credits >= ship.cost.credits)
                  {
                    capital.resources.credits -= ship.cost.credits
                    bought = true
                  }
                  break
                }
              }

              if (bought)
              {
                const newShip = new Ship(this.nextShipId++, "unnamed", ship, player, capital.id)
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
      case "platoon-increase-troops":
      {
        const body = data as { platoon: PlatoonID, amount: number }
        if (body.platoon !== undefined && body.amount)
        {
          const platoon = this.platoons.find((p) => p.id === body.platoon)
          if (!platoon)
          {
            reason = "Invalid platoon"
          }
          else if (platoon.owner !== player)
          {
            console.log(body.platoon, platoon.id, platoon.owner, player)
            reason = "Incorrect platoon owner"
          }
          else
          {
            platoon.modifyTroops(body.amount)
            result = true
            resultData = { world: { platoons: [platoon.toJSON()] } }
          }
        }
        else
        {
          reason = "Action data missing"
        }
        break
      }
      case "platoon-decrease-troops":
      {
        const body = data as { platoon: PlatoonID, amount: number }
        if (body.platoon !== undefined && body.amount)
        {
          const platoon = this.platoons.find((p) => p.id === body.platoon)
          if (!platoon)
          {
            reason = "Invalid platoon"
          }
          else if (platoon.owner !== player)
          {
            reason = "Incorrect platoon owner"
          }
          // TODO verify available population and modify
          else
          {
            platoon.modifyTroops(body.amount)
            result = true
            resultData = { world: { platoons: [platoon.toJSON()] } }
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
        const body = data as { platoon: PlatoonID }
        if (body.platoon !== undefined)
        {
          const platoon = this.platoons.find((p) => p.id === body.platoon)
          if (!platoon)
          {
            reason = "Invalid platoon"
          }
          else if (platoon.owner !== player)
          {
            reason = "Incorrect platoon owner"
          }
          // TODO verify available credits (of capital) and modify
          else
          {
            const capital = this.planets.find((p) => p.capital === true && p.owner === player)
            if (!capital)
            {
              reason = "Failed to find player capital"
            }
            else
            {
              platoon.recruit("suit_1", "weapon_1", capital.id)
              result = true
              resultData = { world: { platoons: [platoon.toJSON()] } }
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
    this.date.day += 1 * delta

    if (this.date.day > this.yearDuration)
    {
      this.date.day = 1
      this.date.year += 1
    }

    this.planets.forEach((planet) => {
      if (planet.simulate(delta))
      {
        // changes.planets.push(planet.id)
      }
    })
  }

  updateFor(player: string): IUniverse
  {
    const universe: IUniverse = {
      // Don't send partial days
      date: { day: Math.floor(this.date.day), year: this.date.year },
      yearDuration: this.yearDuration, // DAYS_PER_YEAR
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
        radius: planet.radius,
        location: planet.location,
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
          ...planet
        }
      }
      else
      {
        // Send limited data
        planetData.name = "Classified"
      }

      universe.planets.push(planetData)
    })

    const findPlanetForShip = (id: number) => {
      return this.planets.find((p) => p.id === id)
    }

    // TODO ships
    this.ships.forEach((ship) => {
      let shipData: IShipBasic | IShip = {
        id: ship.id,
        type: ship.type,
        name: ship.name,
        owner: ship.owner,
        location: { ...ship.location },
      }

      if (ship.owner === player)
      {
        // Send all data...
        shipData = {
          ...ship
        }
      }
      else
      {
        // Send limited data
      }

      universe.ships.push(shipData)
    })

    // TODO platoons
    this.platoons.forEach((platoon) => {
      let platoonData: IPlatoonBasic | IPlatoon = {
        id: platoon.id,
        name: platoon.name,
        owner: platoon.owner,
        location: { ...platoon.location },
        status: platoon.status,
        strength: platoon.strength,
      }

      if (platoon.owner === player)
      {
        // Send all data
        platoonData = {
          ...platoon
        }
      }
      else
      {
        // Send limited data
      }

      universe.platoons.push(platoonData)
    })

    return universe
  }
}
