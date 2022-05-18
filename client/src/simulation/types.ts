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

export type PlayerGameAction = "rename-planet"
  | "transfer-credits"
  | "planet-modify-tax"
  | "planet-terraform"
  | "purchase-ship"
  | "ship-rename"
  | "ship-modify-passengers"
  | "ship-modify-fuels"
  | "ship-modify-cargo"
  | "ship-add-crew"
  | "ship-empty-cargo"
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
