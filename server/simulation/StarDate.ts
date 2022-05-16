import { IDate, DAYS_PER_YEAR } from "./types"

export { DAYS_PER_YEAR }

class StarDate implements IDate
{
  day: number
  year: number

  constructor()
  {
    this.day = 1
    this.year = 3000
  }

  clone(): StarDate
  {
    const d = new StarDate()
    d.day = this.day
    d.year = this.year
    return d
  }

  inc(delta: number)
  {
    this.day += 1 * delta

    if (this.day > DAYS_PER_YEAR)
    {
      this.day = 1
      this.year += 1
    }

    return this
  }

  add(days: number)
  {
    // FIXME
    for (let i = 0; i < days; i++)
    {
      this.inc(1)
    }

    return this
  }

  floor()
  {
    this.day = Math.floor(this.day)
    this.year = Math.floor(this.year)
    return this
  }

  ceil()
  {
    this.day = Math.ceil(this.day)
    this.year = Math.ceil(this.year)
    return this
  }
}

export default StarDate