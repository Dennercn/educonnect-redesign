import { useEffect, useState } from 'react'

/** Estado sincronizado com o localStorage (persistência local de demonstração). */
export function useLocalStorage<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) return JSON.parse(raw) as T
    } catch {
      /* valor corrompido: usa o inicial */
    }
    return initial instanceof Function ? initial() : initial
  })

  useEffect(() => {
    try {
      if (value === null || value === undefined) localStorage.removeItem(key)
      else localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* armazenamento indisponível (modo privado, cota) */
    }
  }, [key, value])

  return [value, setValue] as const
}
