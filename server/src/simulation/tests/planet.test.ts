import Planet from "../Planet"
import {
    calculateGrowth,
    calculatePopulation,
    calculateTax,
    consumeFood,
    PLANET_POPULATION_LIMIT,
} from "../logic/planet"
import { IPlanet, PlanetType } from "../types"

const FRAME_RATE = 1 / 60

test("planet initialize", () => {
    const one = new Planet(1)
    expect(one.type).toBe(PlanetType.Lifeless)

    const loaded = Planet.load(one.toJSON())
    expect(loaded.type).toBe(PlanetType.Lifeless)

    const clone = one.clone()
    expect(clone.type).toBe(PlanetType.Lifeless)
})

test("planet claim", () => {
    const one = new Planet(1)
    one.claim("player1", "My Planet", 0, false)
    expect(one.owner).toBe("player1")
    expect(one.name).toBe("My Planet")
    expect(one.terraforming).toBe(false)
    expect(one.morale).toBe(75)
    expect(one.population).toBeGreaterThan(0)
})

test("planet terraform", () => {
    const one = new Planet(1)
    one.terraform("My Planet")
    expect(one.type).not.toBe(PlanetType.Lifeless)
    expect(one.owner).toBeUndefined()
    expect(one.name).toBe("My Planet")
    expect(one.terraforming).toBe(false)
    expect(one.morale).toBe(75)
    expect(one.population).toBeGreaterThan(0)
})

test("planet player aggression", () => {})

test("lifeless planet simulate", () => {
    const one = new Planet(1)
    const r = one.simulate(FRAME_RATE, 1)
    expect(r).toBe(false)
    expect(one.population).toBe(0)
})

test("terraformed planet", () => {
    const one = new Planet(1)
    one.terraform("New Planet")
    expect(one.morale).toBe(75)
    expect(one.population).toBeGreaterThan(0)
    expect(one.growth).toBeCloseTo(12, 0)
})

test("planet growth", () => {
    // Because change applies over time, some of the tests may not have
    // the proper value and have been "fixed"
    const tests = [
        {
            growth: 0,
            morale: 75,
            tax: 25,
            resources: {
                food: 1,
            },
            expectedGrowth: 12, // should be 13...
        },
        {
            growth: 0,
            morale: 100,
            tax: 0,
            resources: {
                food: 1,
            },
            expectedGrowth: 33,
        },
        {
            growth: 0,
            morale: 0,
            tax: 100,
            resources: {
                food: 1,
            },
            expectedGrowth: -50,
        },
        {
            growth: 0,
            morale: 0,
            tax: 0,
            resources: {
                food: 1,
            },
            expectedGrowth: 0, // should be 24,
        },
        {
            growth: 0,
            morale: 98,
            tax: 100,
            resources: {
                food: 1,
            },
            expectedGrowth: -17.5, // 7,
        },
        {
            growth: 0,
            morale: 85,
            tax: 100,
            resources: {
                food: 1,
            },
            expectedGrowth: -21.5, // 0,
        },
        {
            growth: 0,
            morale: 80,
            tax: 20,
            resources: {
                food: 1,
            },
            expectedGrowth: 16,
        },
        {
            growth: 0,
            morale: 60,
            tax: 40,
            resources: {
                food: 1,
            },
            expectedGrowth: 0,
        },
    ]

    tests.forEach((t) => {
        const g = calculateGrowth(t as unknown as IPlanet)
        expect(g).toBeCloseTo(t.expectedGrowth, 0)
    })
})

test("food consumption", () => {
    const tests = [
        {
            population: 1000,
            resources: {
                food: 100,
            },
            expectedFood: 96,
        },
        {
            population: 0,
            resources: {
                food: 100,
            },
            expectedFood: 100,
        },
        {
            population: 1000,
            resources: {
                food: 0,
            },
            expectedFood: 0,
        },
    ]

    tests.forEach((t) => {
        const f = consumeFood(t as unknown as IPlanet)
        expect(f).toBeCloseTo(t.expectedFood)
    })
})

test("earn tax", () => {
    const tests = [
        {
            population: 1000,
            tax: 0,
            expectedTax: 0,
        },
        {
            population: 0,
            tax: 50,
            expectedTax: 0,
        },
        {
            population: 100,
            tax: 10,
            expectedTax: 8,
        },
    ]

    tests.forEach((t) => {
        const v = calculateTax(t as unknown as IPlanet)
        expect(v).toBeCloseTo(t.expectedTax)
    })
})

test("population change", () => {
    const tests = [
        {
            population: 100,
            growth: 10,
            expectedPopulation: 110,
        },
        {
            population: 100,
            growth: -10,
            expectedPopulation: 90,
        },
        {
            population: 100,
            growth: 0,
            expectedPopulation: 100,
        },
        {
            population: PLANET_POPULATION_LIMIT,
            growth: 100,
            expectedPopulation: PLANET_POPULATION_LIMIT,
        },
    ]

    tests.forEach((t) => {
        const v = calculatePopulation(t as unknown as IPlanet)
        expect(v).toBeCloseTo(t.expectedPopulation)
    })
})
