import crypto from "crypto"
import plantTypes from "./data/planettypes.json"
import { IPlanet, IPlanetResources, IPlanetHistory, PlanetID, PlanetType, StarDate } from "./types"
import { random, randomFloat } from "./utilities"

const PLANET_POPULATION_LIMIT = 30000
const GROWTH_TIME = 1
const TAX_TIME = 2

class PlanetHistory implements IPlanetHistory
{
  credits: number[]
  population: number[]
  growth: number[]
  food: number[]
  minerals: number[]
  fuels: number[]
  energy: number[]

  timer: number
  limit: number

  constructor(limit: number = 10)
  {
    this.credits = []
    this.population = []
    this.growth = []
    this.food = []
    this.minerals = []
    this.fuels = []
    this.energy = []

    this.timer = 0
    this.limit = limit
  }

  add(key: string, value: number)
  {
    const arr = this[key as keyof IPlanetHistory]
    arr.push(value)
    if (arr.length > this.limit)
    {
      arr.shift()
    }
  }

  record(delta: number): boolean
  {
    this.timer += delta
    let record = false
    if (this.timer > 1)
    {
      this.timer -= 1
      record = true
    }
    return record
  }
}

export default class Planet implements IPlanet
{
  id: PlanetID
  name: string
  owner?: string
  habitable: boolean
  type: PlanetType
  radius: number
  population: number
  aggression: number
  terraforming: boolean
  terraformDuration: number

  capital: boolean
  growth: number
  morale: number
  tax: number
  status: string
  location: number // ?
  resources: IPlanetResources
  history: PlanetHistory
  multipliers: boolean
  playerAggression: { [key: string]: number }
  growthAt: StarDate
  taxAt: StarDate

  constructor(id: number)
  {
    console.log("Planet:constructor")
    this.id = id
    this.name = "Lifeless"
    this.owner = undefined
    this.habitable = false
    this.type = PlanetType.Lifeless
    this.radius = random(4000, 25000)
    this.population = 0
    // Aggression is never set specifically, but is required by the IPlanet interface
    this.aggression = 0
    this.terraforming = false
    this.terraformDuration = randomFloat(5, 10)
    this.capital = false
    this.growth = 0
    this.morale = 0
    this.tax = 0
    this.status = ""
    // Y position (for now)?
    this.location = id
    this.resources = {
      credits: 0,
      food: 0,
      minerals: 0,
      fuels: 0,
      energy: 0
    }
    this.history = new PlanetHistory()
    this.multipliers = false
    // FIXME may not be the best place for this
    this.playerAggression = {}
    this.growthAt = 0
    this.taxAt = 0
  }

  load(data: Planet)
  {
    Object.assign(this, data)
  }

  toJSON()
  {
    return this
  }

  getPlayerAggression(player: string)
  {
    if (!this.playerAggression[player])
    {
      this.playerAggression[player] = 25
    }

    return this.playerAggression[player]
  }

  clone()
  {
    const other = new Planet(0)
    Object.assign(other, this)
    return other
  }

  simulate(delta: number, date: StarDate)
  {
    let changed = false
    if (this.type === PlanetType.Lifeless)
    {
      if (this.terraforming)
      {
        changed = true
      }
    }
    else
    {
      let starvation = false

      if (this.history.record(delta))
      {
        this.history.add("credits", this.resources.credits)
        this.history.add("population", this.population)
        this.history.add("growth", this.growth)
        this.history.add("food", this.resources.food)
        this.history.add("minerals", this.resources.minerals)
        this.history.add("fuels", this.resources.fuels)
        this.history.add("energy", this.resources.energy)
      }

      if (this.growthAt < date)
      {
        this.growthAt = date + GROWTH_TIME

        const targetMorale = 100 - this.tax

        if (starvation)
        {
          this.morale = 1
        }
        else
        {
          // update morale
        }

        const baseGrowth = -50 * (this.tax / 100)
        const targetGrowth = 33 * (this.morale / 100)

        // on planet?
        const growthAdjustment = 0

        const diff = targetGrowth - growthAdjustment
        if (targetGrowth < growthAdjustment)
        {

        }
        else if (targetGrowth > growthAdjustment)
        {

        }

        this.growth = Math.ceil(baseGrowth + growthAdjustment)

        if (targetGrowth < this.growth)
        {
          this.growth -= 0.5
        }
        else
        {
          this.growth += 0.5
        }

        const populationGrowth = (this.population / 4) * (this.growth / 100)
        this.population += populationGrowth

        if (this.population < 1)
        {
          this.population = 0
        }
        else if (this.population > PLANET_POPULATION_LIMIT)
        {
          this.population = PLANET_POPULATION_LIMIT
        }
      }

      if (this.taxAt < date)
      {
        this.taxAt = date += TAX_TIME

        const creditsPerPopulation = (0.08 * this.tax)
        this.resources.credits += this.population * creditsPerPopulation
      }

      changed = true
    }

    return changed
  }

  claim(owner: string, name: string, date: StarDate, capital: boolean = false)
  {
    this.terraform(name)
    this.owner = owner
    this.capital = capital
    this.playerAggression = {
      [owner]: 25,
    }

    if (capital)
    {
      this.type = PlanetType.Metropolis
      this.population = random(1000, 2000)
      this.resources.credits = random(50000, 60000)
      this.resources.food = random(3000, 5000)
      this.resources.minerals = random(2000, 5000)
      this.resources.fuels = random(2000, 5000)
      this.resources.energy = random(2000, 5000)
    }

    this.growthAt = date + GROWTH_TIME
    this.taxAt = date + TAX_TIME
  }

  terraform(name: string)
  {
    const planetTypeKeys = Object.keys(PlanetType)

    this.name = name
    this.population = 0
    this.habitable = true
    this.terraforming = false
    this.type = (planetTypeKeys[random(0, planetTypeKeys.length)] as PlanetType)
    this.population = 1000
    this.growth = 0
    this.morale = 75
    this.tax = 25
    this.resources.credits = 0
    this.resources.food = 1000
    this.resources.minerals = 20
    this.resources.fuels = 150
    this.resources.energy = 35
  }
}
