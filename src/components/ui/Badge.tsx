import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Clock3, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Situation } from '../../types'

export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

const tones: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-500/30',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30',
  danger: 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30',
  info: 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30',
}

export function Badge({ tone = 'neutral', icon: Icon, children, className }: { tone?: Tone; icon?: LucideIcon; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset', tones[tone], className)}>
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </span>
  )
}

// A situação nunca é comunicada só pela cor: sempre ícone + texto.
export const situationMeta: Record<Situation, { label: string; tone: Tone; icon: LucideIcon }> = {
  aprovado: { label: 'Aprovado', tone: 'success', icon: CheckCircle2 },
  recuperacao: { label: 'Recuperação', tone: 'warning', icon: AlertTriangle },
  reprovado: { label: 'Reprovado', tone: 'danger', icon: XCircle },
  cursando: { label: 'Cursando', tone: 'info', icon: Clock3 },
}

export function SituationBadge({ value }: { value: Situation }) {
  const m = situationMeta[value]
  return <Badge tone={m.tone} icon={m.icon}>{m.label}</Badge>
}
