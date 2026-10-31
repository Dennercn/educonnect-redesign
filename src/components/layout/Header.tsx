import { useCallback, useRef, useState } from 'react'
import { Bell, CheckCheck, ChevronDown, ClipboardList, GraduationCap, LogOut, Moon, ShieldCheck, Sun, UserRound } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { student } from '../../data/mock'
import { useDismiss } from '../../hooks/useDismiss'
import { initials } from '../../lib/academic'
import { cn } from '../../lib/cn'
import type { AppNotification, Page } from '../../types'
import { IconButton } from '../ui/Button'
import { Avatar } from '../ui/Misc'
import { Logo } from './Logo'
import { pageTitles } from './nav'

const kindIcon: Record<AppNotification['kind'], { icon: typeof Bell; className: string }> = {
  warning: { icon: ClipboardList, className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
  info: { icon: GraduationCap, className: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300' },
  success: { icon: ShieldCheck, className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
}

const popover = 'z-50 animate-scale-in origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-raised dark:border-slate-800 dark:bg-slate-900'

export function Header({ page, onNavigate, onLogout }: { page: Page; onNavigate: (p: Page) => void; onLogout: () => void }) {
  const { profile, theme, toggleTheme, notifications, setNotifications } = useApp()
  const [open, setOpen] = useState<'notifications' | 'user' | null>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(null), [])
  useDismiss(notifRef, open === 'notifications', close)
  useDismiss(userRef, open === 'user', close)

  const unread = notifications.filter(n => !n.read).length
  const displayName = profile.socialName || profile.name
  const firstName = displayName.split(' ')[0]

  const go = (p: Page) => { setOpen(null); onNavigate(p) }
  const openNotification = (n: AppNotification) => {
    setNotifications(list => list.map(x => (x.id === n.id ? { ...x, read: true } : x)))
    go(n.page)
  }

  return (
    <header className="sticky top-0 z-30 print:hidden border-b border-slate-200/70 bg-slate-50/85 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <button onClick={() => onNavigate('dashboard')} className="rounded-xl md:hidden" aria-label="EduConnect — ir para o início">
            <Logo compact />
          </button>
          <p className="hidden text-sm text-slate-500 dark:text-slate-400 md:block">
            Área do aluno <span aria-hidden className="mx-1.5">/</span>
            <span className="font-semibold text-slate-900 dark:text-white">{pageTitles[page]}</span>
          </p>
        </div>

        <div className="flex items-center gap-1">
          <IconButton label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'} icon={theme === 'dark' ? Sun : Moon} onClick={toggleTheme} />

          <div ref={notifRef} className="relative">
            <IconButton
              label={unread ? `Notificações (${unread} não lidas)` : 'Notificações'}
              icon={Bell}
              badge={unread}
              aria-expanded={open === 'notifications'}
              aria-haspopup="true"
              onClick={() => setOpen(o => (o === 'notifications' ? null : 'notifications'))}
            />
            {open === 'notifications' && (
              <div className={cn(popover, 'fixed inset-x-3 top-[4.5rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96')}>
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="font-semibold">Notificações</p>
                  <button
                    disabled={!unread}
                    onClick={() => setNotifications(list => list.map(n => ({ ...n, read: true })))}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50 disabled:text-slate-400 disabled:hover:bg-transparent dark:text-brand-300 dark:hover:bg-brand-500/10"
                  >
                    <CheckCheck className="h-4 w-4" aria-hidden /> Marcar como lidas
                  </button>
                </div>
                <ul className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                  {notifications.map(n => {
                    const { icon: Icon, className } = kindIcon[n.kind]
                    return (
                      <li key={n.id}>
                        <button onClick={() => openNotification(n)} className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60">
                          <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', className)}><Icon className="h-4 w-4" aria-hidden /></span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className={cn('text-sm', n.read ? 'font-medium text-slate-700 dark:text-slate-300' : 'font-semibold text-slate-900 dark:text-white')}>{n.title}</span>
                              {!n.read && <span className="h-2 w-2 rounded-full bg-brand-600 dark:bg-brand-400" aria-label="não lida" />}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-600 dark:text-slate-400">{n.description}</span>
                            <span className="mt-1 block text-[11px] text-slate-500">{n.time}</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>

          <div ref={userRef} className="relative ml-1">
            <button
              onClick={() => setOpen(o => (o === 'user' ? null : 'user'))}
              aria-expanded={open === 'user'}
              aria-haspopup="true"
              aria-label={`Menu da conta de ${displayName}`}
              className="flex items-center gap-2 rounded-xl p-1 pr-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 sm:pr-2"
            >
              <Avatar text={initials(displayName)} size="sm" />
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight text-slate-900 dark:text-white">{firstName}</span>
                <span className="block text-xs leading-tight text-slate-500 dark:text-slate-400">RA {student.ra}</span>
              </span>
              <ChevronDown className={cn('hidden h-4 w-4 text-slate-500 transition-transform sm:block', open === 'user' && 'rotate-180')} aria-hidden />
            </button>
            {open === 'user' && (
              <div className={cn(popover, 'absolute right-0 top-full mt-2 w-64 p-1.5')}>
                <div className="flex items-center gap-3 px-3 py-3">
                  <Avatar text={initials(displayName)} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{displayName}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{profile.email}</p>
                  </div>
                </div>
                <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
                <MenuItem icon={UserRound} onClick={() => go('perfil')}>Meu perfil</MenuItem>
                <MenuItem icon={theme === 'dark' ? Sun : Moon} onClick={toggleTheme}>{theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</MenuItem>
                <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
                <MenuItem icon={LogOut} danger onClick={() => { setOpen(null); onLogout() }}>Sair do sistema</MenuItem>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function MenuItem({ icon: Icon, children, onClick, danger }: { icon: typeof Bell; children: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
        danger ? 'text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
      )}
    >
      <Icon className="h-4 w-4" aria-hidden /> {children}
    </button>
  )
}
