import { BookOpen, ClipboardList, GraduationCap, LayoutDashboard, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Page } from '../../types'

export const navItems: { id: Page; label: string; short: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Início', short: 'Início', icon: LayoutDashboard },
  { id: 'notas', label: 'Notas e boletim', short: 'Notas', icon: GraduationCap },
  { id: 'disciplinas', label: 'Disciplinas', short: 'Aulas', icon: BookOpen },
  { id: 'matricula', label: 'Matrícula', short: 'Matrícula', icon: ClipboardList },
  { id: 'perfil', label: 'Meu perfil', short: 'Perfil', icon: UserRound },
]

export const pageTitles: Record<Page, string> = Object.fromEntries(navItems.map(n => [n.id, n.label])) as Record<Page, string>
