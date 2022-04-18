import { IPlatoon, IPlatoonLocation, PlanetID, PlatoonStatus } from "./types";
import { modifyWithin } from "./utilities";



export default class Platoon implements IPlatoon
{
  id: number
  name: string
  owner: string
  status: PlatoonStatus
  strength: number
  suit: string
  equipment: string
  troops: number
  location: IPlatoonLocation
  calibre: number
  rank: string

  constructor(id: number, name: string, owner: string)
  {
    this.id = id
    this.name = name
    this.owner = owner
    this.status = PlatoonStatus.None
    this.strength = 0
    this.suit = ""
    this.equipment = ""
    this.troops = 0
    this.location = {
      planet: undefined,
      ship: undefined,
    }
    this.calibre = 0
    this.rank = ""
  }

  load(data: Platoon)
  {
    Object.assign(this, data)
  }

  toJSON()
  {
    return this
  }

  modifyTroops(amount: number)
  {
    if (this.status === PlatoonStatus.None || this.status === PlatoonStatus.Training)
    {
      this.troops = modifyWithin(this.troops, amount, 0, 200)
      if (this.troops > 0)
      {
        this.status = PlatoonStatus.Training
      }
    }
  }

  recruit(suit: string, equipment: string, planet: PlanetID,)
  {
    this.status = PlatoonStatus.Recruited
    this.strength = 0
    this.suit = suit
    this.equipment = equipment
    this.location.planet = planet
  }
}