import AvailableEvents from "../data/events.json"
import { random } from "../utilities"
import { StarDate } from "../types"

interface IEventEffect {
    type: string
    position?: string
    ship?: string
    duration?: number
}

interface IUniverseEvent {
    id: string
    type: string
    name: string
    description: string
    repeat: boolean
    when?: number
    frequency?: number[]
    effects: IEventEffect[]
}

export class UniverseEvent implements IUniverseEvent {
    id: string
    type: string
    name: string
    description: string
    repeat: boolean
    when?: StarDate
    frequency?: number[]
    effects: IEventEffect[]
    lastOccurred?: StarDate
    completed: boolean

    constructor(
        {
            id,
            type,
            name,
            description,
            repeat,
            when,
            frequency,
            effects,
        }: IUniverseEvent,
        date: StarDate
    ) {
        this.id = id
        this.type = type
        this.name = name
        this.description = description
        this.repeat = repeat
        this.when = when
        this.frequency = frequency
        this.effects = effects
        this.lastOccurred = undefined
        this.completed = false

        if (this.when === undefined) {
            this.setNextDate(date)
        }

        console.log(`Event '${name}' will occur on ${this.when}`)
    }

    setNextDate(date: StarDate) {
        if (this.frequency) {
            this.when = date + random(this.frequency[0], this.frequency[1])
        }
    }
}

export const load = (
    date: StarDate,
    data: IUniverseEvent[] = AvailableEvents
) => {
    return data.map(
        (item) => new UniverseEvent(item, date as unknown as StarDate)
    )
}
