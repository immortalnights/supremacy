// Duplicate of server/simulation/types.ts

export enum PlanetType {
  Lifeless = "Lifeless",
  Volcanic = "Volcanic",
  Desert = "Desert",
  Tropical = "Tropical",
  Metropolis = "Metropolis"
}

export enum Difficulty {
  Easy,
  Medium,
  Hard,
  Impossible,
}

export type ShipTask = "idle" | "traveling" | "harvesting" | "terraforming"

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

export enum PlatoonStatus {
  None,
  Training,
  Recruited,
  Defeated,
}

export const DAYS_PER_YEAR = 48;
