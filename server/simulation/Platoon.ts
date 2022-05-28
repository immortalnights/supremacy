import { IPlatoon, IPlatoonLocation, PlanetID, PlatoonStatus } from "./types";
import { modifyWithin } from "./utilities";

const Ranks = {
  0: "Cadet",
  10: "2nd Lieutenant",
  20: "Captain",
  30: "Major",
  40: "Lieutenant Colonel",
  50: "Colonel",
  60: "1 Star General",
  70: "2 Star General",
  80: "3 Star General",
  90: "4 Star General",
  100: "5 Star General",
}

const MAX_CALIBRE = 100
const TRAINING_TIME = 120

const getRank = (calibre: number) => {
  let key = 0
  if (calibre > 0)
  {
    key = (Math.floor(calibre / 10) * 10)
  }

  return Ranks[key as keyof typeof Ranks]
}

export default class Platoon implements IPlatoon
{
  id: number
  name: string
  owner: string
  status: PlatoonStatus
  suit: string
  equipment: string
  troops: number
  location: IPlatoonLocation
  calibre: number
  // rank: string

  constructor(id: number, name: string, owner: string)
  {
    this.id = id
    this.name = name
    this.owner = owner
    this.status = PlatoonStatus.None
    this.suit = ""
    this.equipment = ""
    this.troops = 0
    this.location = {
      planet: undefined,
      ship: undefined,
    }
    this.calibre = 0
  }

  get rank()
  {
    return getRank(this.calibre)
  }

  get strength()
  {
    return 0
  }

  load(data: Platoon)
  {
    Object.assign(this, data)
  }

  toJSON()
  {
    return { ...this, strength: this.strength, rank: this.rank }
  }

  modifyTroops(amount: number)
  {
    if (this.status === PlatoonStatus.None || this.status === PlatoonStatus.Training)
    {
      const previousTroops = this.troops
      this.troops = modifyWithin(this.troops, amount, 0, 200)
      if (this.troops > 0)
      {
        this.status = PlatoonStatus.Training
      }
      else
      {
        this.status = PlatoonStatus.None
      }

      if (this.troops === 0)
      {
        this.calibre = 0
      }
      else if (this.calibre > 0 && this.troops > previousTroops)
      {
        this.calibre -= 0.25 * (this.troops - previousTroops)
        if (this.calibre < 0)
        {
          this.calibre = 0
        }
      }
    }
  }

  train(delta: number)
  {
    if (this.status === PlatoonStatus.Training && this.calibre < 100)
    {
      this.calibre += (MAX_CALIBRE / TRAINING_TIME) * delta

      if (this.calibre > 100)
      {
        this.calibre = 100
      }
    }
  }

  recruit(suit: string, equipment: string, planet: PlanetID)
  {
    this.status = PlatoonStatus.Recruited
    this.suit = suit
    this.equipment = equipment
    this.location.planet = planet
  }
}