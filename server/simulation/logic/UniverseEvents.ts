import AvailableEvents from "../data/events.json"
import StarDate from "../StarDate"
import { random } from "../utilities"

interface IEventEffect {
  type: string
  position?: string
  ship?: string
  duration?: number
}

interface IUniverseEvent {
  type: string
  name: string
  description: string
  repeat: boolean
  when?: number
  frequency?: number[]
  effects: IEventEffect[]
}

export class UniverseEvent implements IUniverseEvent {
  type: string
  name: string
  description: string
  repeat: boolean
  when?: number
  frequency?: number[]
  effects: IEventEffect[]
  occurred?: StarDate
  completed: boolean

  constructor({ type, name, description, repeat, when, frequency, effects }: IUniverseEvent, date: StarDate)
  {
    this.type = type
    this.name = name
    this.description = description
    this.repeat = repeat
    this.when = when
    this.frequency = frequency
    this.effects = effects
    this.occurred = undefined
    this.completed = false

    if (this.when === undefined)
    {
      this.setNextDate(date)
    }
  }

  setNextDate(date: StarDate)
  {
    if (this.frequency)
    {
      const when = random(this.frequency[0], this.frequency[1])
    }
  }
}

export const load = (date: StarDate, data: IUniverseEvent[] = AvailableEvents) => {
  return data.map((item) => new UniverseEvent(item, date))
}