
export const useLocalStorageValue = (key: string) => {
  const value = localStorage.getItem(key)
  return value
}