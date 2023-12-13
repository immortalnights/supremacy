import Universe from "./Universe.js"
import Planet from "./Planet.js"
import { IChanges } from "./types.js"
import { parentPort } from "node:worker_threads"

let universe: Universe | null = null
let simulateTimeout: NodeJS.Timeout | number | undefined

interface IMessage {
    type: string
    changes?: IChanges
    data: unknown
}

const post = (msg: IMessage) => {
    if (global.postMessage) {
        global.postMessage(msg)
    } else {
        parentPort?.postMessage(msg)
    }
}

const simulate = () => {
    const FPS = 1

    let time = Date.now()

    simulateTimeout = setInterval(() => {
        const now = Date.now()
        const uni = universe as Universe
        uni.simulate(now - time)
        time = now

        post({
            type: "UPDATE",
            changes: undefined,
            data: uni,
        })
    }, 1000 / FPS)
}

const startUniverse = () => {
    console.debug("Starting universe, post initial update")
    post({
        type: "UPDATE",
        changes: undefined,
        data: universe,
    })

    setTimeout(() => {
        console.debug("Starting simulation")
        simulate()
    }, 1)
}

const dispatch = (msg: IMessage) => {
    console.log("Received", msg)
    switch (msg.type) {
        case "LOAD": {
            console.debug("Parsing save game data", msg.data)
            universe = new Universe()
            // Assign save game data to the Universe class
            Object.assign(universe, msg.data)
            // Map planets as Planet instances
            universe.planets.map((p) => {
                const planet = new Planet(p.id)
                Object.assign(planet, p)
                return planet
            })

            startUniverse()
            break
        }
        case "CREATE": {
            // create
            universe = new Universe()

            startUniverse()
            break
        }
        case "START": {
            simulate()
            break
        }
        case "QUIT": {
            clearInterval(simulateTimeout as number)
            console.log("Simulation stopped")
            break
        }
        default: {
            console.error(`Received unhandled message '${msg.type}'`)
            break
        }
    }
}

if (global.onmessage) {
    global.onmessage = (e) => dispatch(e.data as IMessage)
} else {
    parentPort?.on("message", (message) => dispatch(message as IMessage))
}

export default simulate
