import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

export function Card({ children, className, as: Tag = 'section', ...rest }: { children: ReactNode; className?: string; as?: 'section' | 'article' | 'div' | 'aside'; 'aria-labelledby'?: string }) {
  return <Tag className={cn('card', className)} {...rest}>{children}</Tag>
}

export function CardHeader({ title, description, action, id }: { title: string; description?: string; action?: ReactNode; id?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="min-w-0">
        <h2 id={id} className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 id="page-title" tabIndex={-1} className="mt-1 text-2xl font-extrabold text-slate-900 outline-none dark:text-white sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

const barTones = {
  brand: 'bg-brand-600 dark:bg-brand-400',
  success: 'bg-emerald-600 dark:bg-emerald-400',
  warning: 'bg-amber-500 dark:bg-amber-400',
  danger: 'bg-rose-600 dark:bg-rose-400',
}

export function ProgressBar({ value, max = 100, tone = 'brand', label, className, marker }: { value: number; max?: number; tone?: keyof typeof barTones; label: string; className?: string; marker?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={Math.round(value * 10) / 10} aria-valuemin={0} aria-valuemax={max} className={cn('relative h-2 rounded-full bg-slate-200/80 dark:bg-slate-800', className)}>
      <div className={cn('h-full origin-left animate-grow rounded-full', barTones[tone])} style={{ width: `${pct}%` }} />
      {marker !== undefined && (
        <span className="absolute -top-1 bottom-[-4px] w-0.5 rounded-full bg-slate-500 dark:bg-slate-400" style={{ left: `${(marker / max) * 100}%` }} aria-hidden />
      )}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <p className="mt-4 font-semibold text-slate-900 dark:text-white">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/** Controle segmentado (filtros exclusivos), com contagem opcional. */
export function Segmented<T extends string>({ value, onChange, options, label, className }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; count?: number; icon?: LucideIcon }[]; label: string; className?: string }) {
  return (
    <div role="group" aria-label={label} className={cn('scrollbar-thin flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800/70', className)}>
      {options.map(o => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
              active ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            {o.icon && <o.icon className="h-4 w-4" aria-hidden />}
            {o.label}
            {o.count !== undefined && (
              <span className={cn('rounded-md px-1.5 text-xs tabular-nums', active ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300')}>
                {o.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function Avatar({ text, size = 'md', className }: { text: string; size?: 'sm' | 'md' | 'xl'; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-display font-bold text-white',
        { sm: 'h-9 w-9 text-xs', md: 'h-10 w-10 text-sm', xl: 'h-24 w-24 text-3xl ring-4 ring-white dark:ring-slate-900' }[size],
        className,
      )}
    >
      {text}
    </span>
  )
}

export function SearchInput({ value, onChange, placeholder, label, className }: { value: string; onChange: (v: string) => void; placeholder: string; label: string; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
      <input type="search" aria-label={label} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input pl-10" />
    </div>
  )
}
