
export const randomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}