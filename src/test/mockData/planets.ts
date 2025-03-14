import { ColonizedPlanet, LifelessPlanet } from "Supremacy/entities"

export const lifelessPlanet: LifelessPlanet = {
    id: "11",
    name: "",
    type: "lifeless",
    terraformDuration: 5,
    terraformedType: "dessert",
    gridIndex: 0,
}

export const colonizedPlanet: ColonizedPlanet = {
    id: "31",
    name: "Test Planet",
    owner: "local",
    type: "metropolis",
    capital: true,
    population: 0,
    credits: 0,
    morale: 1,
    growth: 0,
    tax: 0,
    aggression: {},
    gridIndex: 0,
    food: 0,
    minerals: 0,
    fuels: 0,
    energy: 0,
}
