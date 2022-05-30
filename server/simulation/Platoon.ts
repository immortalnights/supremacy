import { IPlatoon, IPlatoonLocation, PlanetID, PlatoonStatus } from "./types";
import { modifyWithin } from "./utilities";
import { Ranks, defaultSuit, defaultWeapon, MAX_TROOPS, MAX_CALIBRE, TRAINING_TIME,  } from "./logic/platoons"
import EquipmentData from "./data/equipment.json"
import { defaults } from "lodash";

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
    this.suit = defaultSuit
    this.equipment = defaultWeapon
    this.troops = 0
    this.location = {
      planet: undefined,
      ship: undefined,
    }
    this.calibre = 0
  }

  get rank(): string
  {
    return getRank(this.calibre)
  }

  get strength(): number
  {
    let strength = 0
    if (this.status === PlatoonStatus.Recruited)
    {
      const suit = EquipmentData[this.suit as keyof typeof EquipmentData] as { "armour": number }
      const weapon = EquipmentData[this.equipment as keyof typeof EquipmentData] as { "damage": number }
      strength = this.troops + Math.floor((suit.armour + weapon.damage) * this.troops * (this.calibre / 100))
    }
    return strength
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

  recruit(planet: PlanetID)
  {
    this.status = PlatoonStatus.Recruited
    this.location.planet = planet
  }

  dismiss()
  {
    this.status = PlatoonStatus.None
    this.suit = defaultSuit
    this.equipment = defaultWeapon
    this.location.planet = undefined
    this.location.ship = undefined
    this.calibre = 0
  }
}