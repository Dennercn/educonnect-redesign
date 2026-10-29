import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  icon?: LucideIcon
  error?: string
  hint?: ReactNode
  onChange?: (value: string) => void
}

/** Campo de formulário com rótulo, dica e mensagem de erro ligados ao input via ARIA. */
export function Field({ label, icon: Icon, error, hint, onChange, className, required, ...props }: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-0.5 text-rose-600" aria-hidden>*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />}
        <input
          id={id}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          onChange={e => onChange?.(e.target.value)}
          className={cn('input', Icon && 'pl-10')}
          {...props}
        />
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 flex animate-fade-in items-center gap-1 text-xs font-medium text-rose-700 dark:text-rose-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden /> {error}
        </p>
      ) : (
        hint && <p id={hintId} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  )
}
