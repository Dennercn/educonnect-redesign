import { useState } from 'react'
import type { FormEvent } from 'react'
import { BookOpen, Eye, EyeOff, GraduationCap, IdCard, Lock, LogIn, Moon, ShieldCheck, Sun } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { student } from '../data/mock'
import { Logo } from '../components/layout/Logo'
import { Button, IconButton } from '../components/ui/Button'
import { Field } from '../components/ui/Field'

export function Login({ onLogin }: { onLogin: () => void }) {
  const { theme, toggleTheme } = useApp()
  const [ra, setRa] = useState(student.ra)
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState<{ ra?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!/^\d{8}$/.test(ra)) next.ra = 'Informe o RA com 8 dígitos.'
    if (password.length < 6) next.password = 'A senha deve ter pelo menos 6 caracteres.'
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    onLogin()
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" aria-hidden />
        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20"><GraduationCap className="h-6 w-6" aria-hidden /></span>
          <span className="font-display text-xl font-extrabold">EduConnect</span>
        </div>
        <div className="relative mt-auto max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">Sua vida acadêmica, organizada em um só lugar.</h2>
          <p className="mt-4 text-lg text-brand-100">Notas, horários, matrícula e dados pessoais com poucos toques, em qualquer dispositivo.</p>
          <ul className="mt-10 space-y-4 text-sm">
            {[
              { icon: GraduationCap, text: 'Boletim com médias, frequência e situação' },
              { icon: BookOpen, text: 'Grade semanal com professores e salas' },
              { icon: ShieldCheck, text: 'Matrícula guiada, com verificação de conflitos' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15"><Icon className="h-4 w-4" aria-hidden /></span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <span className="lg:invisible"><Logo /></span>
          <IconButton label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'} icon={theme === 'dark' ? Sun : Moon} onClick={toggleTheme} />
        </div>
        <div className="mx-auto my-auto w-full max-w-sm animate-fade-up py-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Entrar</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Acesse o portal com seu RA e senha.</p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-5">
            <Field label="RA (registro acadêmico)" icon={IdCard} value={ra} inputMode="numeric" autoComplete="username" maxLength={8} onChange={v => setRa(v.replace(/\D/g, ''))} error={errors.ra} required />
            <div>
              <Field
                label="Senha"
                icon={Lock}
                type={show ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={setPassword}
                error={errors.password}
                hint="Demonstração: qualquer senha com 6 ou mais caracteres."
                required
              />
              <button type="button" onClick={() => setShow(s => !s)} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300" aria-pressed={show}>
                {show ? <EyeOff className="h-3.5 w-3.5" aria-hidden /> : <Eye className="h-3.5 w-3.5" aria-hidden />}
                {show ? 'Ocultar senha' : 'Mostrar senha'}
              </button>
            </div>
            <Button type="submit" size="lg" icon={LogIn} loading={loading} className="w-full">{loading ? 'Entrando...' : 'Entrar'}</Button>
          </form>
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">Ambiente de demonstração · dados fictícios</p>
        </div>
      </main>
    </div>
  )
}
