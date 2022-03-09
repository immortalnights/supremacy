import crypto from "crypto"
import { IPlanet } from "./types"

export default class Planet implements IPlanet
{
  id: number
  population: number

  constructor(id: number)
  {
    console.log("Planet:constructor")
    this.id = id
    this.population = 0
  }
}
