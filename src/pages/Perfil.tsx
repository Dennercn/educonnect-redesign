import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { FormEvent, ReactNode } from 'react'
import { BadgeCheck, Bell, Building2, CalendarDays, GraduationCap, Home, IdCard, KeyRound, Lock, Mail, MapPin, Moon, Phone, Save, ShieldCheck, Undo2, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { student } from '../data/mock'
import { formatDate, initials } from '../lib/academic'
import { cn } from '../lib/cn'
import type { Profile } from '../types'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { Field } from '../components/ui/Field'
import { Avatar, Card, PageHeader, ProgressBar } from '../components/ui/Misc'

type Errors = Partial<Record<keyof Profile, string>>

const states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
const maskCep = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

function validate(p: Profile): Errors {
  const e: Errors = {}
  if (p.socialName && p.socialName.trim().length < 3) e.socialName = 'Use pelo menos 3 letras ou deixe em branco.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email.trim())) e.email = 'Informe um e-mail válido, como nome@dominio.com.'
  const phone = p.phone.replace(/\D/g, '')
  if (phone.length < 10) e.phone = 'Informe DDD + número (10 ou 11 dígitos).'
  if (p.cep.replace(/\D/g, '').length !== 8) e.cep = 'O CEP deve ter 8 dígitos.'
  if (p.address.trim().length < 5) e.address = 'Informe rua e número.'
  if (p.city.trim().length < 2) e.city = 'Informe a cidade.'
  return e
}

export function Perfil() {
  const { profile, setProfile, theme, toggleTheme } = useApp()
  const notify = useToast()
  const [form, setForm] = useState<Profile>(profile)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Profile, boolean>>>({})
  const [saving, setSaving] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [emailNotifications, setEmailNotifications] = useLocalStorage('educonnect-email-notifications', true)

  const dirty = (Object.keys(form) as (keyof Profile)[]).some(k => form[k] !== profile[k])

  // Avisa antes de sair da página com alterações não salvas
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const set = (key: keyof Profile, value: string) => {
    const next = { ...form, [key]: value }
    setForm(next)
    if (touched[key]) setErrors(validate(next))
  }
  const blur = (key: keyof Profile) => () => {
    setTouched(t => ({ ...t, [key]: true }))
    setErrors(validate(form))
  }
  const err = (key: keyof Profile) => (touched[key] ? errors[key] : undefined)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    setTouched(Object.fromEntries(Object.keys(form).map(k => [k, true])))
    if (Object.keys(found).length) {
      notify('Revise os campos destacados.', 'error')
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    const clean = { ...form, email: form.email.trim(), socialName: form.socialName.trim(), address: form.address.trim(), city: form.city.trim() }
    setProfile(clean)
    setForm(clean)
    setSaving(false)
    setTouched({})
    notify('Dados atualizados com sucesso!')
  }

  const discard = () => {
    setForm(profile)
    setErrors({})
    setTouched({})
    notify('Alterações descartadas.', 'info')
  }

  const displayName = form.socialName || form.name

  return (
    <div className={cn(dirty && 'pb-20')}>
      <PageHeader eyebrow="Conta" title="Meu perfil" description="Mantenha seus dados de contato atualizados para receber avisos da secretaria e dos professores." />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr] [&>*]:min-w-0">
        {/* Identidade acadêmica (somente leitura) */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-brand-600 to-accent-500" aria-hidden />
            <div className="-mt-12 px-5 pb-5 text-center">
              <Avatar text={initials(displayName)} size="xl" className="mx-auto" />
              <p className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">{displayName}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">RA {student.ra}</p>
              <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Matrícula ativa
              </span>
            </div>
            <dl className="space-y-3 border-t border-slate-100 p-5 text-sm dark:border-slate-800">
              <Info icon={GraduationCap} label="Curso" value={student.course} />
              <Info icon={CalendarDays} label="Período" value={`${student.period} · ingresso ${student.entry}`} />
              <Info icon={Building2} label="Unidade" value={`${student.campus} · ${student.shift}`} />
            </dl>
            <div className="border-t border-slate-100 p-5 dark:border-slate-800">
              <div className="mb-2 flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">Progresso no curso</span><span className="font-semibold tabular-nums">{Math.round((student.completedCredits / student.totalCredits) * 100)}%</span></div>
              <ProgressBar value={student.completedCredits} max={student.totalCredits} label="Progresso no curso" />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{student.completedCredits} de {student.totalCredits} créditos concluídos</p>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Preferências</h2>
            <div className="mt-4 space-y-4">
              <Switch icon={Moon} label="Tema escuro" description="Reduz o brilho em ambientes com pouca luz." checked={theme === 'dark'} onChange={toggleTheme} />
              <Switch icon={Bell} label="Avisos por e-mail" description="Notas publicadas e prazos de matrícula." checked={emailNotifications} onChange={() => { setEmailNotifications(v => !v); notify(emailNotifications ? 'Avisos por e-mail desativados.' : 'Avisos por e-mail ativados.', 'info') }} />
            </div>
          </Card>
        </div>

        {/* Formulário */}
        <form id="perfil-form" onSubmit={submit} noValidate className="space-y-6">
          <FormSection icon={User} title="Dados pessoais" description="Nome civil, CPF e data de nascimento só podem ser alterados na secretaria.">
            <Field label="Nome completo" icon={Lock} value={form.name} disabled hint="Alteração mediante documento na secretaria." />
            <Field label="Nome social" icon={User} value={form.socialName} onChange={v => set('socialName', v)} onBlur={blur('socialName')} error={err('socialName')} placeholder="Opcional" hint="Será exibido no portal no lugar do nome civil." />
            <Field label="CPF" icon={Lock} value={form.cpf.replace(/^(\d{3})\.\d{3}\.\d{3}/, '$1.***.***')} disabled />
            <Field label="Data de nascimento" icon={Lock} value={formatDate(form.birthDate, { day: '2-digit', month: '2-digit', year: 'numeric' })} disabled />
          </FormSection>

          <FormSection icon={Mail} title="Contato" description="Usamos estes dados para avisos importantes.">
            <Field label="E-mail" icon={Mail} type="email" autoComplete="email" value={form.email} onChange={v => set('email', v)} onBlur={blur('email')} error={err('email')} required />
            <Field label="Celular" icon={Phone} type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={v => set('phone', maskPhone(v))} onBlur={blur('phone')} error={err('phone')} placeholder="(00) 00000-0000" required />
          </FormSection>

          <FormSection icon={Home} title="Endereço">
            <Field label="CEP" icon={MapPin} inputMode="numeric" autoComplete="postal-code" value={form.cep} onChange={v => set('cep', maskCep(v))} onBlur={blur('cep')} error={err('cep')} placeholder="00000-000" required />
            <Field label="Logradouro e número" icon={Home} autoComplete="street-address" value={form.address} onChange={v => set('address', v)} onBlur={blur('address')} error={err('address')} required />
            <Field label="Cidade" icon={Building2} autoComplete="address-level2" value={form.city} onChange={v => set('city', v)} onBlur={blur('city')} error={err('city')} required />
            <div>
              <label htmlFor="uf" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Estado<span className="ml-0.5 text-rose-600" aria-hidden>*</span></label>
              <select id="uf" value={form.state} onChange={e => set('state', e.target.value)} autoComplete="address-level1" className="input h-[42px] cursor-pointer">
                {states.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </FormSection>

          <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"><ShieldCheck className="h-5 w-5" aria-hidden /></span>
            <div className="flex-1">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Segurança</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Senha alterada pela última vez há 3 meses.</p>
            </div>
            <Button variant="secondary" icon={KeyRound} onClick={() => setPasswordOpen(true)}>Alterar senha</Button>
          </Card>

          {/* Barra de alterações não salvas (portal: fica fixa na tela, fora do <main> animado) */}
          {dirty && createPortal(
            <div className="fixed inset-x-0 bottom-16 z-30 animate-slide-up px-3 md:bottom-4 md:left-20 lg:left-72">
              <div role="region" aria-label="Alterações não salvas" className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-slate-900 p-3 pl-4 text-white shadow-raised ring-1 ring-white/10 dark:bg-slate-800">
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-400" aria-hidden />
                <p className="flex-1 text-sm font-medium">Alterações não salvas</p>
                <Button variant="ghost" size="sm" icon={Undo2} onClick={discard} disabled={saving} className="text-slate-200 hover:bg-white/10 hover:text-white dark:hover:bg-white/10">Descartar</Button>
                <Button type="submit" form="perfil-form" size="sm" icon={Save} loading={saving} >{saving ? 'Salvando...' : 'Salvar'}</Button>
              </div>
            </div>,
            document.body,
          )}
        </form>
      </div>

      <PasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} onDone={() => { setPasswordOpen(false); notify('Senha alterada com sucesso!') }} />
    </div>
  )
}

function FormSection({ icon: Icon, title, description, children }: { icon: typeof User; title: string; description?: string; children: ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"><Icon className="h-5 w-5" aria-hidden /></span>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">{children}</div>
    </Card>
  )
}

function Info({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
      <div>
        <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="font-medium text-slate-800 dark:text-slate-200">{value}</dd>
      </div>
    </div>
  )
}

function Switch({ icon: Icon, label, description, checked, onChange }: { icon: typeof User; label: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" aria-hidden />
      <span className="flex-1">
        <span className="block text-sm font-medium text-slate-900 dark:text-white">{label}</span>
        <span className="block text-xs text-slate-600 dark:text-slate-400">{description}</span>
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2',
          checked ? 'bg-brand-600 dark:bg-brand-500' : 'bg-slate-300 dark:bg-slate-700',
        )}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200', checked ? 'translate-x-[22px]' : 'translate-x-0.5')} />
      </span>
    </label>
  )
}

function strength(p: string) {
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++
  if (/\d/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}

function PasswordDialog({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (open) { setCurrent(''); setNext(''); setConfirm(''); setSubmitted(false) } }, [open])

  const s = strength(next)
  const errors = {
    current: current.length < 6 ? 'Informe sua senha atual.' : undefined,
    next: s < 3 ? 'Use 8+ caracteres com maiúsculas, minúsculas e números.' : undefined,
    confirm: confirm !== next || !confirm ? 'As senhas não coincidem.' : undefined,
  }
  const labels = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte']
  const tone = s <= 1 ? 'danger' : s === 2 ? 'warning' : 'success'

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (errors.current || errors.next || errors.confirm) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    onDone()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      locked={loading}
      title="Alterar senha"
      description="Por segurança, escolha uma senha que você não usa em outros sites."
      icon={<span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"><IdCard className="h-6 w-6" aria-hidden /></span>}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" form="password-form" loading={loading}>{loading ? 'Salvando...' : 'Salvar nova senha'}</Button>
        </>
      }
    >
      <form id="password-form" onSubmit={submit} noValidate className="space-y-4">
        <Field label="Senha atual" type="password" autoComplete="current-password" value={current} onChange={setCurrent} error={submitted ? errors.current : undefined} data-autofocus />
        <div>
          <Field label="Nova senha" type="password" autoComplete="new-password" value={next} onChange={setNext} error={submitted ? errors.next : undefined} />
          {next && (
            <div className="mt-2 flex items-center gap-3" aria-live="polite">
              <ProgressBar value={s} max={4} tone={tone} label="Força da senha" className="flex-1" />
              <span className="w-24 text-right text-xs font-medium text-slate-600 dark:text-slate-400">{labels[s]}</span>
            </div>
          )}
        </div>
        <Field label="Confirmar nova senha" type="password" autoComplete="new-password" value={confirm} onChange={setConfirm} error={submitted ? errors.confirm : undefined} />
      </form>
    </Dialog>
  )
}
