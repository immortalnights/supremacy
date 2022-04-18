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

export enum PlatoonStatus {
  None,
  Training,
  Recruited,
  Defeated,
}

export const DAYS_PER_YEAR = 48;
