import { useId } from 'react'
import { cn } from '../../lib/cn'

/**
 * Símbolo EduConnect: um livro aberto (educação) com três pontos ligados
 * acima dele (conexão). Gradiente em azul (do 500 ao 900) da identidade visual.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 64 64" className={cn('h-10 w-10 shrink-0', className)} aria-hidden>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4466c8" />
          <stop offset="1" stopColor="#1c2c5e" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${id}-bg)`} />
      {/* conexão */}
      <path d="M19 21 32 14l13 7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
      <circle cx="19" cy="21" r="3.5" fill="#fff" />
      <circle cx="32" cy="14" r="3.5" fill="#fff" />
      <circle cx="45" cy="21" r="3.5" fill="#fff" />
      {/* livro aberto */}
      <path d="M12 30.5c6.5-2.6 13-2.2 19 1.4V51c-6-3.4-12.5-3.8-19-1.2V30.5Z" fill="#fff" />
      <path d="M52 30.5c-6.5-2.6-13-2.2-19 1.4V51c6-3.4 12.5-3.8 19-1.2V30.5Z" fill="#fff" opacity=".78" />
    </svg>
  )
}

/** `inverted`: texto claro, para fundos escuros (menu lateral e painel do login). */
export function Logo({ compact, inverted }: { compact?: boolean; inverted?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      {!compact && (
        <span className="leading-tight">
          <span className={cn('block font-display text-lg font-extrabold tracking-tight', inverted ? 'text-white' : 'text-slate-900 dark:text-white')}>
            EduConnect
          </span>
          <span className={cn('block text-xs', inverted ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400')}>Portal do aluno</span>
        </span>
      )}
    </span>
  )
}
