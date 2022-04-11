

// Filter the given Object by the predicate, returning a new object with the key/value that match the predicate
export const filterObject = <T, TI>(object: T, predicate: (item: TI) => boolean) => {
  return Object.keys(object).filter((index) => predicate(object[index as keyof typeof object] as any)).reduce((obj, key) => ({
      ...obj,
      [key]: object[key as keyof typeof object]
  }), {})
}