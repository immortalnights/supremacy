import { test, describe, expect } from "vitest"
import {
    canPurchaseShip,
    canAffordShip,
    canPurchaseAtmos,
    deductShipCost,
    purchaseShip,
    canCrewShip,
    crewShip,
} from "./ships"
import catalog from "Supremacy/data/ships.json"
import {
    ColonizedPlanet,
    Ship,
    ShipBlueprint,
    ShipDocked,
    ShipInOrbit,
    ShipOnSurface,
    ShipPosition,
} from "./entities"
import { Difficulty } from "./types"
import { DAYS_PER_YEAR } from "./consts"

describe.each(catalog.map((blueprint) => blueprint.class))(
    "check ship %s",
    (shipClass) => {
        describe.each([["Easy"], ["Normal"], ["Hard"]])(
            "difficulty %s",
            (difficultyStr) => {
                const difficulty = difficultyStr as Difficulty
                const credits = 100000
                const energy = 100000
                const minerals = 100000

                const makeCapital = (): ColonizedPlanet => {
                    return {
                        id: "capital",
                        gridIndex: 0,
                        name: "Capital",
                        type: "metropolis",
                        owner: "player1",
                        population: 0,
                        capital: true,
                        morale: 100,
                        growth: 0,
                        tax: 0,
                        food: 0,
                        credits,
                        minerals,
                        energy,
                        fuels: 10000,
                        aggression: {},
                    }
                }

                const blueprint = catalog.find(
                    (b) => b.class === shipClass,
                ) as ShipBlueprint

                test(`can afford ${shipClass}`, () => {
                    const capital = makeCapital()

                    expect(canAffordShip(capital, blueprint.cost, difficulty)).toBe(
                        true,
                    )

                    capital.minerals = 0
                    expect(canAffordShip(capital, blueprint.cost, "Hard")).toBe(false)
                    expect(canAffordShip(capital, blueprint.cost, "Normal")).toBe(true)
                    expect(canAffordShip(capital, blueprint.cost, "Easy")).toBe(true)

                    capital.energy = 0
                    expect(canAffordShip(capital, blueprint.cost, "Hard")).toBe(false)
                    expect(canAffordShip(capital, blueprint.cost, "Normal")).toBe(false)
                    expect(canAffordShip(capital, blueprint.cost, "Easy")).toBe(true)

                    capital.credits = 0
                    expect(canAffordShip(capital, blueprint.cost, "Hard")).toBe(false)
                    expect(canAffordShip(capital, blueprint.cost, "Normal")).toBe(false)
                    expect(canAffordShip(capital, blueprint.cost, "Easy")).toBe(false)
                })

                test(`can purchase ${shipClass}`, () => {
                    const capital = makeCapital()
                    const blueprint = catalog.find(
                        (b) => b.class === shipClass,
                    ) as ShipBlueprint

                    const modifiedCapital = deductShipCost(
                        capital,
                        blueprint.cost,
                        difficulty,
                    )
                    expect(modifiedCapital.credits).toEqual(
                        credits - blueprint.cost.credits,
                    )

                    if (difficulty === "Normal" || difficulty === "Hard") {
                        expect(modifiedCapital.energy).toEqual(
                            energy - blueprint.cost.energy,
                        )
                    }

                    if (difficulty === "Hard") {
                        expect(modifiedCapital.minerals).toEqual(
                            minerals - blueprint.cost.minerals,
                        )
                    }
                })

                test(`commission ${shipClass}`, () => {
                    const capital = makeCapital()
                    const ships: Ship[] = []

                    expect(
                        canPurchaseShip(
                            capital,
                            ships,
                            blueprint,
                            1 + DAYS_PER_YEAR,
                            difficulty,
                        ),
                    ).toBe(true)

                    const name = "new ship"
                    const [modifiedPlanets, modifiedShips] = purchaseShip(
                        capital.owner,
                        [capital],
                        ships,
                        blueprint,
                        name,
                        1 + DAYS_PER_YEAR,
                        difficulty,
                    )

                    const modifiedCapital = modifiedPlanets[0] as ColonizedPlanet

                    expect(capital).not.toBe(modifiedCapital)

                    // Cost has been deducted
                    expect(modifiedCapital.credits).toEqual(
                        credits - blueprint.cost.credits,
                    )

                    if (difficulty === "Normal" || difficulty === "Hard") {
                        expect(modifiedCapital.energy).toEqual(
                            energy - blueprint.cost.energy,
                        )
                    }

                    if (difficulty === "Hard") {
                        expect(modifiedCapital.minerals).toEqual(
                            minerals - blueprint.cost.minerals,
                        )
                    }

                    // Ship has been added
                    expect(modifiedShips.length).toEqual(1)
                    const newShip = modifiedShips[0]
                    expect(newShip.name).toEqual(name)
                    expect(newShip.position).toEqual("docked")
                    expect((newShip as ShipDocked).location.planet).toEqual(capital.id)
                })
            },
        )
    },
)

test("can purchase Atmosphere ship (date and quantity checks)", () => {
    // To soon
    expect(canPurchaseAtmos(1, 0)).toBe(false)
    // Already owned
    expect(canPurchaseAtmos(100, 1)).toBe(false)
    // Can purchase
    expect(canPurchaseAtmos(100, 0)).toBe(true)
})

describe("ship crew", () => {
    const player = "player1"

    const makeShip = <T extends BaseShip>(
        position: ShipPosition,
        location: T["location"],
    ): T => {
        return {
            id: "ship",
            name: "ship",
            class: "B-29 Battle Cruiser",
            description: "",
            owner: player,
            crew: 0,
            requiredCrew: 10,
            fuels: 0,
            passengers: 0,
            capacity: {
                civilians: 0,
                cargo: 0,
                fuels: 0,
                platoons: 0,
            },
            cargo: { food: 0, minerals: 0, fuels: 0, energy: 0 },
            value: 0,
            position,
            location,
        } as T
    }

    const capital: ColonizedPlanet = {
        id: "capital",
        gridIndex: 0,
        name: "Capital",
        type: "metropolis",
        owner: "player1",
        population: 100,
        capital: true,
        morale: 100,
        growth: 0,
        tax: 0,
        food: 0,
        credits: 0,
        minerals: 0,
        energy: 0,
        fuels: 10000,
        aggression: {},
    }

    test("cannot crew ship not in docking bay", () => {
        const shipInOrbit: ShipInOrbit = makeShip("orbit", { planet: capital.id })
        expect(canCrewShip(player, shipInOrbit, capital)).toBe(false)
    })

    test("cannot crew ship docked at enemy planet", () => {
        const planet = { ...capital, owner: "player2" }
        const dockedShip: ShipInOrbit = makeShip("docked", { planet: planet.id })
        expect(canCrewShip(player, dockedShip, planet)).toBe(false)
    })

    test("cannot crew ship which requires no crew", () => {
        const dockedShip: ShipInOrbit = makeShip("docked", { planet: capital.id })
        dockedShip.requiredCrew = "remote"
        expect(canCrewShip(player, dockedShip, capital)).toBe(false)
    })

    test("cannot crew ship which already has crew", () => {
        const dockedShip: ShipInOrbit = makeShip("docked", { planet: capital.id })
        dockedShip.requiredCrew = 10
        dockedShip.crew = 10
        expect(canCrewShip(player, dockedShip, capital)).toBe(false)
    })

    test("cannot crew ship where planet has no population", () => {
        const planet = { ...capital, population: 0 }
        const dockedShip: ShipInOrbit = makeShip("docked", { planet: planet.id })
        expect(canCrewShip(player, dockedShip, planet)).toBe(false)
    })

    test("can crew ship", () => {
        const dockedShip: ShipInOrbit = makeShip("docked", { planet: capital.id })
        expect(canCrewShip(player, dockedShip, capital)).toBe(true)
    })

    test("can crew ship (with partial existing crew)", () => {
        const dockedShip: ShipInOrbit = makeShip("docked", { planet: capital.id })
        dockedShip.crew = 5
        expect(canCrewShip(player, dockedShip, capital)).toBe(true)
    })

    test("cannot crew does not modify arrays", () => {
        const dockedShip: ShipInOrbit = makeShip("docked", { planet: capital.id })
        dockedShip.requiredCrew = "remote"

        const planets = [capital]
        const ships = [dockedShip]

        const [modifiedPlanets, modifiedShips] = crewShip(
            player,
            planets,
            ships,
            dockedShip,
        )

        expect(modifiedPlanets).toBe(planets)
        expect(modifiedShips).toBe(ships)
    })

    test("crew ship", () => {
        const dockedShip: ShipInOrbit = makeShip("docked", { planet: capital.id })
        dockedShip.requiredCrew = 10

        const originalPopulation = capital.population
        const planets = [capital]
        const ships = [dockedShip]

        const [modifiedPlanets, modifiedShips] = crewShip(
            player,
            planets,
            ships,
            dockedShip,
        )

        expect(modifiedPlanets).not.toBe(planets)
        expect(modifiedShips).not.toBe(ships)

        const modifiedCapital = modifiedPlanets[0] as ColonizedPlanet

        expect(modifiedCapital.population).toBe(
            originalPopulation - dockedShip.requiredCrew,
        )
        expect(modifiedShips[0].crew).toBe(dockedShip.requiredCrew)
    })
})
