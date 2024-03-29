import cloneDeep from "lodash/cloneDeep"

export const canChangePosition = (fromPos, to) => {
    let r = false

    switch (fromPos) {
        case "docked": {
            r = ["surface", "orbit"].includes(to)
            break
        }
        case "orbit": {
            r = ["docked", "space"].includes(to)
            break
        }
        case "surface": {
            r = ["docked"].includes(to)
            break
        }
        case "space": {
            r = ["orbit"].includes(to)
            break
        }
        default: {
            break
        }
    }

    return r
}

export const createShip = (blueprint, id, name, player, planet, date) => {
    const ship = {
        id,
        owner: player.id,
        name: name,
        location: {
            planet: planet.id,
            position: "docked",
            state: "inactive",
        },
        crew: 0,
        fuel: 0,
        civilians: 0,
        cargo: {
            food: 0,
            minerals: 0,
            fuels: 0,
            energy: 0,
        },
        platoons: [],
        purchased: date,
        ...cloneDeep(blueprint),
    }

    return ship
}
