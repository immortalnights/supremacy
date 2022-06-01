export const DAYS_PER_YEAR = 48

export type PlayerGameAction = "rename-planet"
  | "planet-modify-tax"
  | "planet-terraform"
  | "planet-espionage"
  | "planet-modify-aggression"
  | "transfer-credits"
  | "ship-purchase"
  | "ship-rename"
  | "ship-modify-passengers"
  | "ship-modify-fuels"
  | "ship-modify-cargo"
  | "ship-add-crew"
  | "ship-empty-cargo"
  | "ship-toggle-harvesting"
  | "ship-relocate"
  | "ship-travel"
  | "ship-abort-travel"
  | "ship-toggle-surface-status"
  | "ship-decommission"
  | "platoon-modify"
  | "platoon-recruit"
  | "platoon-dismiss"
  | "platoon-relocate"

export enum Difficulty {
  Easy,
  Medium,
  Hard,
  Impossible,
}

export interface IResources {
  food: number
  minerals: number
  fuels: number
  energy: number
}

export interface IPlanetResources extends IResources {
  credits: number
  foodChange: number
}

export enum PlanetType {
  Lifeless = "Lifeless",
  Volcanic = "Volcanic",
  Desert = "Desert",
  Tropical = "Tropical",
  Metropolis = "Metropolis",
}

export type PlanetID = number
export type ShipID = number
export type PlatoonID = number

export interface IPlanetBasic {
  id: PlanetID
  type: PlanetType
  owner?: string
  name: string
  aggression: number
  radius: number
  location: number // ? x pos
  terraforming: boolean
}

export interface IPlanet extends IPlanetBasic {
  habitable: boolean
  population: number
  terraformDuration: number

  capital: boolean
  growth: number
  growthChange: number
  morale: number
  tax: number
  status: string
  resources: IPlanetResources
  multipliers: boolean
}

export interface IShipLocation {
  planet: PlanetID | undefined
  position: string
  x: number
  y: number
}

export interface IShipBasic {
  id: ShipID
  type: string
  name: string
  owner: string
  location: IShipLocation
}

export interface IShipCapacity {
  civilians: number
  cargo: number
  fuels: number
  platoons: number
}

export interface IShipHeading {
  location: PlanetID
  from: PlanetID
  to: PlanetID
  departed: IDate
  arrival: IDate
  fuels: number
}

export interface IShipHarvesting {
  location: string
  resources: IResources
}

export interface IShipHarvester {
  multiplier: number
  start: IDate
}

export interface IShipTerraformer {
  start: IDate
  end: IDate
  planetName: string
}

export type ShipTask = "idle" | "traveling" | "harvesting" | "terraforming"

// FIXME ship location does not include the planet name, but ship heading to/from does...
export interface IShip extends IShipBasic {
  crew: number
  value: number
  cargo: IResources
  passengers: number
  fuels: number
  // Static data
  requiresFuel: boolean
  requiredCrew: number
  capacity: IShipCapacity
  speed: number
  range: number
  heading?: IShipHeading
  harvester?: IShipHarvesting
  task: ShipTask
  equipment?: IShipHarvester | IShipTerraformer
}

export interface IPlatoonLocation {
  planet?: PlanetID
  ship?: ShipID
}

export enum PlatoonStatus {
  None,
  Training,
  Recruited,
  Defeated,
}

export interface IPlatoonBasic {
  id: PlatoonID
  name: string
  owner: string
  status: PlatoonStatus
  location: IPlatoonLocation
  strength: number
}

export interface IPlatoon extends IPlatoonBasic {
  troops: number
  suit: string
  weapon: string
  calibre: number
  aggression: number
  rank: string
}

export interface IDate {
  day: number
  year: number
}

export interface ISolarSystem {
  difficulty: Difficulty
  date: IDate
  yearDuration: number
}

export interface IUniverse extends ISolarSystem {
  planets: (IPlanetBasic | IPlanet)[]
  ships: (IShipBasic | IShip)[]
  platoons: (IPlatoonBasic | IPlatoon)[]
  espionage?: IEspionageReport
}

export interface IShipDetails {
  type: string
  description: string
  shortName: string
  requiredCrew: number
  capacity: IShipCapacity
  speed: number
  range: number
  cost: {
    credits: number
    minerals: number
    energy: number
  }
  value: number
  harvester: IShipHarvesting | null
}

export interface IShipList {
  [key: string]: IShipDetails
}

export interface IEquipment {
  type: string
  name: string
  power: number
  cost: number
}

export interface IEquipmentList {
  [key: string]: IEquipment
}

export interface IEspionageReport extends Partial<IResources> {
  date: IDate,
  planet: {
    id: PlanetID,
    name: string,
  },
  strength?: number,
  civilians?: number,
}