import crypto from "crypto"
import plantTypes from "./data/planettypes.json"
import { IPlanet, IResources, PlanetType } from "./types"

export const random = (min: number, max: number) => {
  return (Math.random() * (max - min)) + min
}

const PLANET_POPULATION_LIMIT = 30000

export default class Planet implements IPlanet
{
  id: number
  owner?: string
  name: string
  habitable: boolean
  type: PlanetType
  radius: number
  population: number
  terraforming: boolean
  terraformDuration: number

  growth: number
  growthChange: number
  morale: number
  tax: number
  status: string
  location: number // ?
  resources: IResources
  multipliers: boolean

  constructor(id: number)
  {
    console.log("Planet:constructor")
    this.id = id
    this.owner = undefined
    this.name = "Lifeless"
    this.habitable = false
    this.type = PlanetType.Lifeless
    this.radius = Math.floor(random(4000, 25000))
    this.population = 0
    this.terraforming = false
    this.terraformDuration = random(5, 10)
    this.growth = 0
    this.growthChange = 0
    this.morale = 0
    this.tax = 0
    this.status = ""
    this.location = 0
    this.resources = {
      credits: 0,
      food: 0,
      foodChange: 0,
      minerals: 0,
      fuels: 0,
      energy: 0
    }
    this.multipliers = false
  }

  load(data: Planet)
  {
    Object.assign(this, data)
  }

  toJSON()
  {
    return this
  }

  clone()
  {
    const other = new Planet(0)
    Object.assign(other, this)
    return other
  }

  simulate(delta: number)
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
      // pay credits every other day

      // handle food consumption

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

      // only change population every other day
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

      changed = true
    }

    return changed
  }

  claim(owner: string, name: string)
  {
    this.terraform(name)
    this.owner = owner
  }

  terraform(name: string)
  {
    const planetTypeKeys = Object.keys(PlanetType)

    this.name = name
    this.population = 1000
    this.habitable = true
    this.type = (planetTypeKeys[random(0, planetTypeKeys.length)] as PlanetType)
    this.population = random(1500, 3000)
    this.growth = 0
    this.growthChange = 0
    this.morale = 75
    this.tax = 25
    this.resources = {
      credits: 0,
      food: random(1000, 3000),
      foodChange: 0,
      minerals: 20,
      fuels: 150,
      energy: 35
    }
  }
}
