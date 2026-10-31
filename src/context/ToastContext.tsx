import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../lib/cn'

type ToastKind = 'success' | 'error' | 'info'
interface Toast { id: number; message: string; kind: ToastKind; action?: { label: string; onClick: () => void } }
type Notify = (message: string, kind?: ToastKind, action?: Toast['action']) => void

const ToastContext = createContext<Notify>(() => {})

export const useToast = () => useContext(ToastContext)

const styles: Record<ToastKind, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: 'text-emerald-400' },
  error: { icon: AlertCircle, className: 'text-rose-400' },
  info: { icon: Info, className: 'text-brand-300' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => setToasts(t => t.filter(x => x.id !== id)), [])

  const notify = useCallback<Notify>((message, kind = 'success', action) => {
    const id = ++nextId.current
    setToasts(t => [...t.slice(-2), { id, message, kind, action }])
    window.setTimeout(() => dismiss(id), action ? 6000 : 4000)
  }, [dismiss])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        aria-live="polite"
        className="toast-region pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end lg:px-6"
      >
        {toasts.map(t => {
          const { icon: Icon, className } = styles[t.kind]
          return (
            <div
              key={t.id}
              role={t.kind === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto flex w-full max-w-sm animate-slide-up items-center gap-3 rounded-2xl bg-slate-900 py-3 pl-4 pr-2 text-sm font-medium text-white shadow-raised ring-1 ring-white/10 dark:bg-slate-800"
            >
              <Icon className={cn('h-5 w-5 shrink-0', className)} aria-hidden />
              <span className="flex-1">{t.message}</span>
              {t.action && (
                <button
                  onClick={() => { t.action!.onClick(); dismiss(t.id) }}
                  className="rounded-lg px-2 py-1 font-semibold text-brand-300 hover:bg-white/10"
                >
                  {t.action.label}
                </button>
              )}
              <button onClick={() => dismiss(t.id)} aria-label="Fechar aviso" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
