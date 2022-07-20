import { IPlanet } from "../types"

export const PLANET_POPULATION_LIMIT = 30000

export const calculatePopulation = ({ population, growth }: IPlanet) => {
  return Math.min(population + Math.floor(population * (growth / 100)), PLANET_POPULATION_LIMIT)
}

export const calculateMorale = ({ morale, tax, resources }: IPlanet) => {
  if (resources.food === 0)
  {
    morale = 1
  }
  else
  {
    const targetMorale = 100 - tax
    if (morale > targetMorale)
    {
      morale -= 1
    }
    else if (morale < targetMorale)
    {
      morale += 1
    }
  }

  return morale
}

export const calculateGrowth = ({ morale, tax }: IPlanet) => {
  return (morale * 0.33) - (tax * 0.5)
}

export const consumeFood = ({ population, resources: { food } }: IPlanet) => {
  return Math.max(Math.floor(food - population * 0.004), 0)
}

export const calculateTax = ({ population, tax }: IPlanet) => {
  return population * (tax * 0.008)
}