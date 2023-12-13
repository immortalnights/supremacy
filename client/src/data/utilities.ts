export const throwError = (message: string): never => {
    throw new Error(message)
}

export const range = (count: number) => [...Array(count).keys()]
