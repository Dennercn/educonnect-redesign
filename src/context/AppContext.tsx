import { createContext, useContext, useEffect } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { initialNotifications, initialProfile } from '../data/mock'
import type { AppNotification, Enrollment, Profile } from '../types'

type Theme = 'light' | 'dark'

interface AppState {
  profile: Profile
  setProfile: Dispatch<SetStateAction<Profile>>
  enrollment: Enrollment | null
  setEnrollment: Dispatch<SetStateAction<Enrollment | null>>
  notifications: AppNotification[]
  setNotifications: Dispatch<SetStateAction<AppNotification[]>>
  theme: Theme
  toggleTheme: () => void
  loggedIn: boolean
  setLoggedIn: (v: boolean) => void
}

const AppContext = createContext<AppState | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de <AppProvider>')
  return ctx
}

const systemTheme = (): Theme => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<Profile>('educonnect-profile', initialProfile)
  const [enrollment, setEnrollment] = useLocalStorage<Enrollment | null>('educonnect-enrollment', null)
  const [notifications, setNotifications] = useLocalStorage('educonnect-notifications', initialNotifications)
  const [theme, setTheme] = useLocalStorage<Theme>('educonnect-theme', systemTheme)
  const [loggedIn, setLoggedIn] = useLocalStorage('educonnect-session', true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#020617' : '#4f46e5')
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <AppContext.Provider
      value={{ profile: { ...initialProfile, ...profile }, setProfile, enrollment, setEnrollment, notifications, setNotifications, theme, toggleTheme, loggedIn, setLoggedIn }}
    >
      {children}
    </AppContext.Provider>
  )
}
