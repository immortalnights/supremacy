import { test, describe, expect } from "vitest"
import { applyRenamePlanet, calculateGrowth } from "./planets"
import type { Planet, ColonizedPlanet, Ship, Atmos } from "./entities"
import { simulatePlanets, simulateShips } from "./tick"

describe("calculate growth", () => {
    const planet = {
        id: "test-planet",
        type: "metropolis",
        name: "Test Planet",
        owner: "player1",
        gridIndex: 0,
        capital: false,
        credits: 0,
        population: 1000,
        food: 5000,
        morale: 75,
        growth: 0,
        tax: 25,
        aggression: { player1: 25 },
        minerals: 0,
        fuels: 0,
        energy: 0,
    } satisfies ColonizedPlanet

    test("happy planet", () => {
        const growth = calculateGrowth(planet)
        expect(growth).toBeCloseTo(12.25)
    })

    test("unhappy planet", () => {
        planet.morale = 0
        const growth = calculateGrowth(planet)
        expect(growth).toBeCloseTo(-12.5)
    })

    test("not tax", () => {
        planet.tax = 0
        const growth = calculateGrowth(planet)
        expect(growth).toBeCloseTo(0)
    })

    test("heavy tax", () => {
        planet.tax = 100
        const growth = calculateGrowth(planet)
        expect(growth).toBeCloseTo(-50)
    })
})

test("rename planet", () => {
    const planet = {
        id: "test-planet",
        type: "metropolis",
        name: "Test Planet",
        owner: "player1",
        gridIndex: 0,
        capital: false,
        credits: 0,
        population: 1000,
        food: 5000,
        morale: 75,
        growth: 0,
        tax: 25,
        aggression: { player1: 25 },
        minerals: 0,
        fuels: 0,
        energy: 0,
    } satisfies ColonizedPlanet

    const newName = "New Planet Name"
    const modifiedPlanets = applyRenamePlanet("player1", [planet], planet.id, newName)
    expect(modifiedPlanets[0]).not.toBe(planet)
    expect(modifiedPlanets[0].name).toBe(newName)
})

describe("simulate planet", () => {
    test("simulate lifeless planet", () => {
        const lifelessPlanet = {
            id: "lifeless-planet",
            gridIndex: 1,
            name: "Lifeless Planet",
            type: "lifeless",
            terraformedType: "metropolis",
            terraformDuration: 10,
        } satisfies Planet

        const modified = simulatePlanets([lifelessPlanet])
        expect(modified[0]).toEqual(lifelessPlanet)
    })

    test("simulate colonized planet", () => {
        const planet = {
            id: "colonized-planet",
            gridIndex: 2,
            name: "Colonized Planet",
            type: "metropolis",
            owner: "player1",
            capital: false,
            credits: 1000,
            population: 2000,
            food: 5000,
            morale: 75,
            growth: 0,
            tax: 25,
            aggression: { player1: 25 },
            minerals: 1000,
            fuels: 500,
            energy: 300,
        } satisfies ColonizedPlanet

        {
            let modified

            modified = simulatePlanets([planet])[0] as ColonizedPlanet
            expect(modified).not.toStrictEqual(planet)
            expect(modified.growth).toBeCloseTo(12.25)
            expect(modified.credits).toBe(1400)
            expect(modified.population).toBe(2000)
            expect(modified.food).toBe(4992)

            modified = simulatePlanets([modified])[0] as ColonizedPlanet
            // expect(modified).not.toStrictEqual(modified)
            expect(modified.growth).toBeCloseTo(12.25)
            expect(modified.credits).toBe(1800)
            expect(modified.population).toBe(2000)
            expect(modified.food).toBe(4984)
        }
    })

    test("simulate starving planet", () => {
        const planets = [
            {
                id: "colonized-planet",
                gridIndex: 2,
                name: "Colonized Planet",
                type: "metropolis",
                owner: "player1",
                capital: false,
                credits: 1000,
                population: 2000,
                food: 8, // one tick of food
                morale: 75,
                growth: 0,
                tax: 25,
                aggression: { player1: 25 },
                minerals: 1000,
                fuels: 500,
                energy: 300,
            },
        ] satisfies ColonizedPlanet[]

        let modified

        modified = simulatePlanets(planets)[0] as ColonizedPlanet
        expect(modified).not.toStrictEqual(planets[0])
        expect(modified.growth).toBeCloseTo(12.25)
        expect(modified.credits).toBe(1400)
        expect(modified.population).toBe(2000)
        expect(modified.food).toBe(0)

        modified = simulatePlanets([modified])[0] as ColonizedPlanet
        // expect(modified).not.toStrictEqual(modified)
        expect(modified.growth).toBeCloseTo(-12.17)
        expect(modified.credits).toBe(1800)
        expect(modified.population).toBe(2000)
        expect(modified.food).toBe(0)

        /// simulate another ten ticks
        for (let i = 0; i < 10; i++) {
            modified = simulatePlanets([modified])[0] as ColonizedPlanet
        }

        expect(modified.growth).toBeCloseTo(-12.17)
        expect(modified.credits).toBe(5800)
        expect(modified.population).toBe(2000)
        expect(modified.food).toBe(0)
    })
})

test("simulate terraforming", () => {
    const planet = {
        id: "lifeless-planet",
        gridIndex: 1,
        name: "Lifeless Planet",
        type: "lifeless",
        terraformedType: "metropolis",
        terraformDuration: 10,
    } satisfies Planet

    const atmos = {
        id: "atmos-ship",
        class: "Atmosphere Processor",
        description: "Processes the atmosphere of lifeless planets.",
        name: "Atmo1",
        // shortName: "Atmos",
        requiredCrew: 10,
        // range: 100,
        capacity: {
            civilians: 0,
            cargo: 0,
            fuels: 0,
            platoons: 0,
        },
        crew: 10,
        fuels: "nuclear",
        passengers: 0,
        cargo: {
            energy: 0,
            minerals: 0,
            fuels: 0,
            food: 0,
        },
        position: "surface",
        location: {
            planet: planet.id,
            index: 0,
        },
        value: 0,
        owner: "player1",
        active: true,
        terraforming: {
            duration: 10,
            remaining: 2,
        },
    } satisfies Ship

    let modifiedPlanets: Planet[] = [planet]
    let modifiedShips: Ship[] = [atmos]

    const ticks = atmos.terraforming.remaining + 1
    for (let i = 0; i < ticks; i++) {
        ;[modifiedShips, modifiedPlanets] = simulateShips(modifiedShips, modifiedPlanets)
    }

    const modifiedPlanet = modifiedPlanets[0]
    const modifiedAtmos = modifiedShips[0] as Atmos

    expect(modifiedPlanet.type).toBe("metropolis")

    const terraformedPlanet = modifiedPlanet as ColonizedPlanet
    expect(terraformedPlanet.population).toBeGreaterThanOrEqual(2000)
    expect(terraformedPlanet.population).toBeLessThanOrEqual(2000)
    expect(terraformedPlanet.owner).toBe(modifiedAtmos.owner)
    expect(terraformedPlanet.credits).toBe(0)
    expect(terraformedPlanet.food).toBe(0)
    expect(terraformedPlanet.minerals).toBe(0)
    expect(terraformedPlanet.fuels).toBe(0)
    expect(terraformedPlanet.energy).toBe(0)
    expect(terraformedPlanet.morale).toBe(75)
    expect(terraformedPlanet.growth).toBe(0)
    expect(terraformedPlanet.tax).toBe(25)
    // FIXME
    // expect(modifiedAtmos?.terraforming).toBe(null)
})
