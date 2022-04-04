import { IPlatoon } from "./types";

export default class Platoon implements IPlatoon
{
  id: number
  name: string
  owner?: string

  constructor(id: number, name: string)
  {
    this.id = id
    this.name = name
    this.owner = undefined
  }
}