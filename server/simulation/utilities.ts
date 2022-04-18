
export const randomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

export const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value))
}

export const modifyWithin = (value: number, change: number, min: number, max: number) => {
  value += change
  return clamp(value, min, max)
}