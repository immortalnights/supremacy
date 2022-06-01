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
  weapon: string
  troops: number
  location: IPlatoonLocation
  calibre: number
  aggression: number

  constructor(id: number, name: string, owner: string)
  {
    this.id = id
    this.name = name
    this.owner = owner
    this.status = PlatoonStatus.None
    this.suit = defaultSuit
    this.weapon = defaultWeapon
    this.troops = 0
    this.location = {
      planet: undefined,
      ship: undefined,
    }
    this.calibre = 0
    // modified by the planet the platoon is located on
    this.aggression = 0
  }

  get rank(): string
  {
    return getRank(this.calibre)
  }

  get strength(): number
  {
    const calibrepc = this.calibre / 100
    const aggressionpc = this.aggression / 100
    // console.log(calibrepc, aggressionpc)

    // magic number
    const BASE_STRENGTH = 277

    // core strength, platoon size percentage (100% = 200) multiplied by calibre percentage of base strength
    const core = (this.troops / 200) * (BASE_STRENGTH * calibrepc)
    // equipment, core multiplied by equipment value
    const equipment = core * (EquipmentData[this.suit as keyof typeof EquipmentData].power + EquipmentData[this.weapon as keyof typeof EquipmentData].power)
    // aggression, core multiplied by aggression "step"
    const aggr = core * ((aggressionpc / .25) - 1)

    // truncate to drop any awkward decimals
    const total = Math.trunc(this.troops + core + equipment + aggr)
    // console.log(platoon.troops, core, equipment, aggr, total)
    return total
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

  recruit(planet: PlanetID, aggression: number)
  {
    this.status = PlatoonStatus.Recruited
    this.location.planet = planet
    this.aggression = aggression
  }

  dismiss()
  {
    this.status = PlatoonStatus.None
    this.suit = defaultSuit
    this.weapon = defaultWeapon
    this.location.planet = undefined
    this.location.ship = undefined
    this.calibre = 0
  }
}