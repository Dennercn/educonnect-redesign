import { cn } from '../../lib/cn'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('h-10 w-10 shrink-0', className)} aria-hidden>
      <rect width="64" height="64" rx="16" className="fill-brand-600 dark:fill-brand-500" />
      <path d="M32 16 10 27l22 11 18-9v12h4V27L32 16Zm-12 18v8c0 3.3 5.4 6 12 6s12-2.7 12-6v-8l-12 6-12-6Z" fill="#fff" />
    </svg>
  )
}

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">EduConnect</span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">Portal do aluno</span>
        </span>
      )}
    </span>
  )
}
