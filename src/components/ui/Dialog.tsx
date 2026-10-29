import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  icon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** Impede fechar durante operações em andamento (ex.: salvando). */
  locked?: boolean
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Diálogo modal acessível: foco preso no conteúdo, Esc fecha,
 * foco retorna ao elemento que abriu e a rolagem da página é bloqueada.
 */
export function Dialog({ open, onClose, title, description, children, footer, icon, size = 'md', locked }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const lockedRef = useRef(locked)
  lockedRef.current = locked

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusables = ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
    const first = ref.current?.querySelector<HTMLElement>('[data-autofocus]') ?? focusables?.[1] ?? focusables?.[0]
    first?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !lockedRef.current) onCloseRef.current()
      if (e.key !== 'Tab' || !ref.current) return
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!items.length) return
      const [firstEl, lastEl] = [items[0], items[items.length - 1]]
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-slate-950/50 backdrop-blur-sm" onClick={() => !locked && onClose()} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={cn(
          'relative flex max-h-[92vh] w-full animate-slide-up flex-col rounded-t-3xl bg-white shadow-raised dark:bg-slate-900 dark:ring-1 dark:ring-slate-800 sm:animate-scale-in sm:rounded-2xl',
          { sm: 'sm:max-w-sm', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl' }[size],
        )}
      >
        <button
          onClick={onClose}
          disabled={locked}
          aria-label="Fechar"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="overflow-y-auto px-5 pb-5 pt-6 sm:px-6">
          {icon && <div className="mb-4">{icon}</div>}
          <h2 id={titleId} className="pr-8 text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
          {description && <div id={descId} className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</div>}
          {children && <div className="mt-5">{children}</div>}
        </div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-slate-800 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
