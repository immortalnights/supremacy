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
  | "purchase-ship"
  | "ship-modify-passengers"
  | "ship-modify-fuels"
  | "ship-add-crew"
  | "ship-empty-cargo"
  | "ship-relocate"
  | "ship-toggle-surface-status"
  | "ship-decommission"
  | "platoon-increase-troops"
  | "platoon-decrease-troops"
  | "platoon-recruit"
  | "platoon-dismiss"

export enum PlatoonStatus {
  None,
  Training,
  Recruited,
  Defeated,
}

export const DAYS_PER_YEAR = 48;
