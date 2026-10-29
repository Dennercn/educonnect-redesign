import { cn } from '../../lib/cn'
import type { Page } from '../../types'
import { navItems } from './nav'

/** Barra de navegação inferior para smartphones (área de toque ≥ 48px). */
export function MobileNav({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 print:hidden border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95 md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {navItems.map(({ id, short, icon: Icon }) => {
          const active = page === id
          return (
            <li key={id}>
              <button
                onClick={() => onNavigate(id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                  active ? 'text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400',
                )}
              >
                <span className={cn('grid h-8 w-14 place-items-center rounded-full transition-all duration-200', active ? 'bg-brand-100 dark:bg-brand-500/20' : 'scale-90')}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                {short}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
