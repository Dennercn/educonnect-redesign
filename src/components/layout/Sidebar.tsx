import { LogOut } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { enrollmentPeriod } from '../../data/mock'
import { cn } from '../../lib/cn'
import type { Page } from '../../types'
import { Logo, LogoMark } from './Logo'
import { navItems } from './nav'

/** Tablet (md): trilho só com ícones. Desktop (lg): menu completo com rótulos. */
export function Sidebar({ page, onNavigate, onLogout }: { page: Page; onNavigate: (p: Page) => void; onLogout: () => void }) {
  const { enrollment } = useApp()
  const enrollmentPending = enrollment?.semester !== enrollmentPeriod.semester

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-20 print:!hidden flex-col border-r border-slate-200 bg-white px-3 py-5 dark:border-slate-800 dark:bg-slate-900 md:flex lg:w-72 lg:px-5">
      <button onClick={() => onNavigate('dashboard')} className="mx-auto rounded-xl lg:mx-0 lg:px-2" aria-label="EduConnect — ir para o início">
        <span className="hidden lg:block"><Logo /></span>
        <LogoMark className="lg:hidden" />
      </button>

      <p className="mt-10 hidden px-3 text-xs font-semibold uppercase tracking-[.14em] text-slate-500 lg:block">Menu</p>
      <nav aria-label="Navegação principal" className="mt-6 lg:mt-3">
        <ul className="space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = page === id
            return (
              <li key={id}>
                <button
                  onClick={() => onNavigate(id)}
                  aria-current={active ? 'page' : undefined}
                  aria-label={label}
                  title={label}
                  className={cn(
                    'group relative flex h-12 w-full items-center justify-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors lg:justify-start',
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                  )}
                >
                  {active && <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-brand-600 dark:bg-brand-400" aria-hidden />}
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="hidden lg:inline">{label}</span>
                  {id === 'matricula' && enrollmentPending && (
                    <>
                      <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-amber-500 lg:hidden" aria-hidden />
                      <span className="ml-auto hidden rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 lg:inline">Aberta</span>
                    </>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-3">
        {enrollmentPending && (
          <button
            onClick={() => onNavigate('matricula')}
            className="hidden w-full rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-left text-white transition hover:shadow-lg hover:shadow-brand-600/25 lg:block"
          >
            <p className="text-sm font-bold">Matrícula {enrollmentPeriod.semester}</p>
            <p className="mt-1 text-xs text-brand-100">Garanta suas vagas até 20/11.</p>
            <span className="mt-3 inline-block rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold">Escolher disciplinas →</span>
          </button>
        )}
        <button
          onClick={onLogout}
          aria-label="Sair do sistema"
          title="Sair do sistema"
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300 lg:justify-start"
        >
          <LogOut className="h-5 w-5" aria-hidden />
          <span className="hidden lg:inline">Sair do sistema</span>
        </button>
      </div>
    </aside>
  )
}
