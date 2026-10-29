import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, ClipboardCheck, Lock, MapPin, Pencil, Printer, RotateCcw, SearchX, Trash2, UserRound, Users, XCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { enrollmentPeriod, offerings, semesters, subjects } from '../data/mock'
import { daysUntil, formatDate, formatSlot, situation, slotsOverlap, weekdayNames, weekdays } from '../lib/academic'
import { cn } from '../lib/cn'
import type { Offering, Page, Weekday } from '../types'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { Card, EmptyState, PageHeader, ProgressBar, SearchInput, Segmented } from '../components/ui/Misc'

type Step = 'select' | 'review' | 'done'

const { minCredits, maxCredits, semester: targetSemester } = enrollmentPeriod

// Histórico: disciplinas aprovadas e pendentes (reprovado) — usado para pré-requisitos e sugestões
const history = semesters.flatMap(s => s.records)
const approved = new Set(history.filter(r => situation(r) === 'aprovado').map(r => r.code))
const failed = new Set(history.filter(r => situation(r) === 'reprovado').map(r => r.code))

function blockReason(o: Offering, selected: Offering[], credits: number): string | null {
  if (selected.some(s => s.code === o.code)) return null
  if (o.vacancies === 0) return 'Turma lotada'
  if (o.prerequisite && !approved.has(o.prerequisite)) return `Requer aprovação em ${subjects[o.prerequisite]?.name ?? o.prerequisite}`
  const clash = selected.find(s => slotsOverlap(s.slot, o.slot))
  if (clash) return `Conflito de horário com ${clash.name}`
  if (credits + o.credits > maxCredits) return `Ultrapassa o limite de ${maxCredits} créditos`
  return null
}

const newProtocol = () => `EC-${targetSemester.replace('.', '')}-${Math.floor(100000 + Math.random() * 900000)}`

export function Matricula({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { enrollment, setEnrollment, setNotifications } = useApp()
  const notify = useToast()
  const current = enrollment?.semester === targetSemester ? enrollment : null

  const [step, setStep] = useState<Step>(current ? 'done' : 'select')
  const [codes, setCodes] = useState<string[]>(current?.codes ?? [])
  const [query, setQuery] = useState('')
  const [day, setDay] = useState<'todos' | Weekday>('todos')
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)

  const chosen = useMemo(() => offerings.filter(o => codes.includes(o.code)), [codes])
  const credits = chosen.reduce((t, o) => t + o.credits, 0)
  const daysLeft = daysUntil(enrollmentPeriod.closesAt)
  const periodOpen = daysLeft >= 0

  const toggle = (code: string) => setCodes(c => (c.includes(code) ? c.filter(x => x !== code) : [...c, code]))

  const visible = offerings.filter(o =>
    (day === 'todos' || o.slot.day === day) &&
    `${o.name} ${o.code} ${o.professor}`.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const goReview = () => { setAgreed(false); setStep('review'); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const confirm = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    const protocol = newProtocol()
    setEnrollment({ semester: targetSemester, codes, protocol, confirmedAt: new Date().toISOString() })
    setNotifications(n => [{ id: `enr-${protocol}`, title: 'Matrícula confirmada', description: `${codes.length} disciplinas · protocolo ${protocol}`, time: 'agora', page: 'matricula', read: false, kind: 'success' }, ...n])
    setSubmitting(false)
    setStep('done')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    notify('Matrícula confirmada com sucesso!')
  }

  const cancelEnrollment = () => {
    const backup = current
    setEnrollment(null)
    setCancelOpen(false)
    setCodes([])
    setStep('select')
    notify('Matrícula cancelada.', 'info', backup ? { label: 'Desfazer', onClick: () => { setEnrollment(backup); setCodes(backup.codes); setStep('done') } } : undefined)
  }

  return (
    <div className={cn(step === 'select' && chosen.length > 0 && 'pb-20 md:pb-0')}>
      <PageHeader
        eyebrow={`Matrícula ${targetSemester}`}
        title={step === 'done' ? 'Matrícula confirmada' : step === 'review' ? 'Revise sua matrícula' : 'Monte sua grade'}
        description={
          step === 'select'
            ? `Escolha entre ${minCredits} e ${maxCredits} créditos. Conflitos de horário e pré-requisitos são verificados automaticamente.`
            : step === 'review'
              ? 'Confira disciplinas, horários e créditos antes de confirmar.'
              : 'Guarde o número do protocolo. Você pode alterar a matrícula até o fim do prazo.'
        }
        actions={
          <Badge tone={periodOpen ? 'success' : 'neutral'} icon={CalendarDays} className="py-1.5">
            {periodOpen ? `Aberta até ${formatDate(enrollmentPeriod.closesAt, { day: '2-digit', month: '2-digit' })} · ${daysLeft} dias` : 'Período encerrado'}
          </Badge>
        }
      />

      <Stepper step={step} />

      {step === 'select' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] [&>*]:min-w-0">
          <section aria-label="Disciplinas ofertadas">
            <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
              <SearchInput label="Pesquisar disciplina ofertada" value={query} onChange={setQuery} placeholder="Buscar disciplina ou professor" className="xl:w-72" />
              <Segmented
                label="Filtrar por dia"
                value={day}
                onChange={setDay}
                options={[{ value: 'todos' as const, label: 'Todos' }, ...weekdays.map(d => ({ value: d, label: d }))]}
              />
            </div>

            {visible.length === 0 ? (
              <Card><EmptyState icon={SearchX} title="Nenhuma disciplina neste filtro" action={<Button variant="secondary" onClick={() => { setQuery(''); setDay('todos') }}>Limpar filtros</Button>} /></Card>
            ) : (
              <ul className="space-y-3">
                {visible.map((o, i) => {
                  const isSelected = codes.includes(o.code)
                  const reason = blockReason(o, chosen, credits)
                  const lowVacancy = o.vacancies > 0 && o.vacancies <= 5
                  return (
                    <li key={o.code} style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-up">
                      <label
                        className={cn(
                          'card relative flex gap-4 p-4 transition-all duration-200 sm:p-5',
                          reason ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-brand-300 hover:shadow-raised dark:hover:border-brand-500/50',
                          isSelected && 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-500 dark:border-brand-400 dark:bg-brand-500/10 dark:ring-brand-400',
                        )}
                      >
                        <input type="checkbox" className="peer sr-only" checked={isSelected} disabled={!!reason} onChange={() => toggle(o.code)} aria-describedby={`${o.code}-meta${reason ? ` ${o.code}-reason` : ''}`} />
                        <span
                          aria-hidden
                          className={cn(
                            'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2',
                            isSelected ? 'scale-105 border-brand-600 bg-brand-600 text-white dark:border-brand-400 dark:bg-brand-400 dark:text-slate-950' : 'border-slate-300 dark:border-slate-600',
                            reason && 'bg-slate-100 dark:bg-slate-800',
                          )}
                        >
                          {isSelected ? <Check className="h-4 w-4" strokeWidth={3} /> : reason ? <Lock className="h-3 w-3 text-slate-500" /> : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">{o.name}</span>
                            {failed.has(o.code) && <Badge tone="warning">Pendente no histórico</Badge>}
                            {lowVacancy && !reason && <Badge tone="danger">Últimas {o.vacancies} vagas</Badge>}
                          </span>
                          <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">{o.description}</span>
                          <span id={`${o.code}-meta`} className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden />{weekdayNames[o.slot.day]}, {o.slot.start}–{o.slot.end}</span>
                            <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" aria-hidden />{o.professor}</span>
                            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" aria-hidden />{o.room}</span>
                            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" aria-hidden />{o.vacancies}/{o.totalVacancies} vagas</span>
                          </span>
                          {reason && (
                            <span id={`${o.code}-reason`} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden /> {reason}
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{o.credits}</span>
                          <span className="block text-[11px] text-slate-500">créditos</span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          {/* Resumo — desktop */}
          <aside className="hidden lg:block">
            <div className="card sticky top-24 p-5">
              <Summary chosen={chosen} credits={credits} onRemove={toggle} />
              <Button className="mt-5 w-full" iconRight={ArrowRight} disabled={credits < minCredits || !periodOpen} onClick={goReview}>Revisar matrícula</Button>
              {credits < minCredits && <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">Faltam {minCredits - credits} créditos para o mínimo.</p>}
            </div>
          </aside>
        </div>
      )}

      {/* Resumo — barra fixa no smartphone/tablet */}
      {step === 'select' && chosen.length > 0 && createPortal(
        <div className="fixed inset-x-0 bottom-16 z-30 animate-slide-up border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95 md:bottom-0 md:left-20 lg:hidden">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{chosen.length} disciplina{chosen.length > 1 && 's'} · {credits} créditos</p>
              <ProgressBar value={credits} max={maxCredits} marker={minCredits} tone={credits < minCredits ? 'warning' : 'success'} label="Créditos selecionados" className="mt-1.5" />
            </div>
            <Button iconRight={ArrowRight} disabled={credits < minCredits || !periodOpen} onClick={goReview}>Revisar</Button>
          </div>
        </div>,
        document.body,
      )}

      {step === 'review' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] [&>*]:min-w-0">
          <Card className="overflow-hidden">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {chosen.map(o => (
                <li key={o.code} className="flex items-center gap-4 p-4 sm:p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"><Check className="h-5 w-5" aria-hidden /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{o.name}</p>
                    <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{formatSlot(o.slot)} · {o.room} · {o.professor}</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{o.credits} cr</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 p-4 dark:border-slate-800 sm:p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Sua semana em {targetSemester}</p>
              <WeekStrip chosen={chosen} />
            </div>
          </Card>
          <aside className="card h-fit p-5 lg:sticky lg:top-24">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-slate-600 dark:text-slate-400">Disciplinas</dt><dd className="font-semibold">{chosen.length}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600 dark:text-slate-400">Créditos</dt><dd className="font-semibold">{credits} de {maxCredits}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600 dark:text-slate-400">Carga horária</dt><dd className="font-semibold">{chosen.reduce((t, o) => t + o.workload, 0)} h</dd></div>
            </dl>
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-brand-600" />
              <span className="text-slate-700 dark:text-slate-300">Li e concordo com as regras de matrícula e trancamento do período {targetSemester}.</span>
            </label>
            <div className="mt-5 flex flex-col gap-2">
              <Button icon={ClipboardCheck} loading={submitting} disabled={!agreed} onClick={confirm}>{submitting ? 'Confirmando...' : 'Confirmar matrícula'}</Button>
              <Button variant="ghost" icon={ArrowLeft} disabled={submitting} onClick={() => setStep('select')}>Voltar e editar</Button>
            </div>
          </aside>
        </div>
      )}

      {step === 'done' && current && (
        <Card className="mx-auto max-w-3xl overflow-hidden">
          <div className="flex flex-col items-center bg-gradient-to-b from-emerald-50 to-transparent px-6 pb-6 pt-10 text-center dark:from-emerald-500/10">
            <span className="grid h-16 w-16 animate-scale-in place-items-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
              <CheckCircle2 className="h-9 w-9" aria-hidden />
            </span>
            <p className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">Tudo certo para {targetSemester}!</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Confirmada em {new Date(current.confirmedAt).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
            <p className="mt-4 rounded-xl bg-white px-4 py-2 font-mono text-sm font-semibold tracking-wider text-slate-900 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
              Protocolo {current.protocol}
            </p>
          </div>
          <ul className="divide-y divide-slate-100 border-y border-slate-100 dark:divide-slate-800 dark:border-slate-800">
            {offerings.filter(o => current.codes.includes(o.code)).map(o => (
              <li key={o.code} className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white">{o.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{formatSlot(o.slot)} · {o.room}</p>
                </div>
                <span className="shrink-0 text-sm tabular-nums text-slate-600 dark:text-slate-400">{o.credits} cr</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 p-5 sm:flex-row sm:flex-wrap sm:p-6 print:hidden">
            <Button variant="secondary" icon={Pencil} disabled={!periodOpen} onClick={() => { setCodes(current.codes); setStep('select') }}>Alterar matrícula</Button>
            <Button variant="secondary" icon={Printer} onClick={() => window.print()}>Imprimir comprovante</Button>
            <Button variant="ghost" icon={XCircle} className="text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 sm:ml-auto" onClick={() => setCancelOpen(true)}>Cancelar matrícula</Button>
          </div>
          <div className="border-t border-slate-100 px-5 py-4 text-center dark:border-slate-800 print:hidden">
            <button onClick={() => onNavigate('dashboard')} className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300">Voltar ao início</button>
          </div>
        </Card>
      )}

      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        size="sm"
        title="Cancelar a matrícula?"
        description={`Suas vagas em ${current?.codes.length ?? 0} disciplinas serão liberadas. Você poderá se matricular novamente enquanto o período estiver aberto.`}
        icon={<span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"><RotateCcw className="h-6 w-6" aria-hidden /></span>}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelOpen(false)} data-autofocus>Manter matrícula</Button>
            <Button variant="danger" icon={Trash2} onClick={cancelEnrollment}>Cancelar matrícula</Button>
          </>
        }
      />
    </div>
  )
}

function Stepper({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: 'select', label: 'Escolher' },
    { id: 'review', label: 'Revisar' },
    { id: 'done', label: 'Comprovante' },
  ]
  const idx = steps.findIndex(s => s.id === step)
  return (
    <ol aria-label="Etapas da matrícula" className="mb-6 flex items-center gap-2 sm:gap-3">
      {steps.map((s, i) => (
        <li key={s.id} aria-current={i === idx ? 'step' : undefined} className="flex flex-1 items-center gap-2 sm:gap-3">
          <span
            className={cn(
              'grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors duration-300',
              i < idx ? 'bg-emerald-600 text-white' : i === idx ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-500/20' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {i < idx ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : i + 1}
          </span>
          <span className={cn('text-sm font-medium', i === idx ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400', i !== idx && 'hidden sm:inline')}>
            {s.label}
            {i < idx && <span className="sr-only"> (concluída)</span>}
          </span>
          {i < steps.length - 1 && <span className={cn('h-0.5 flex-1 rounded-full transition-colors duration-500', i < idx ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800')} aria-hidden />}
        </li>
      ))}
    </ol>
  )
}

function Summary({ chosen, credits, onRemove }: { chosen: Offering[]; credits: number; onRemove: (code: string) => void }) {
  return (
    <>
      <h2 className="text-base font-bold text-slate-900 dark:text-white">Resumo</h2>
      <div className="mt-4">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">Créditos</span>
          <span className="font-display text-2xl font-extrabold tabular-nums">{credits}<span className="text-sm font-medium text-slate-500">/{maxCredits}</span></span>
        </div>
        <ProgressBar value={credits} max={maxCredits} marker={minCredits} tone={credits < minCredits ? 'warning' : 'success'} label="Créditos selecionados" />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Mínimo {minCredits} · máximo {maxCredits} créditos</p>
      </div>
      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
        {chosen.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">Nenhuma disciplina selecionada ainda.</p>
        ) : (
          <ul className="space-y-2">
            {chosen.map(o => (
              <li key={o.code} className="flex animate-fade-in items-center gap-2 rounded-xl bg-slate-50 py-2 pl-3 pr-1 dark:bg-slate-800/60">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{o.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{formatSlot(o.slot)} · {o.credits} cr</span>
                </span>
                <button onClick={() => onRemove(o.code)} aria-label={`Remover ${o.name}`} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-400">
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

function WeekStrip({ chosen }: { chosen: Offering[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {weekdays.map(d => {
        const list = chosen.filter(o => o.slot.day === d)
        return (
          <div key={d} className={cn('rounded-xl p-2.5 text-center', list.length ? 'bg-brand-50 dark:bg-brand-500/10' : 'bg-slate-50 dark:bg-slate-800/40')}>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{d}</p>
            {list.length ? list.map(o => <p key={o.code} className="mt-1 truncate text-xs font-semibold text-brand-800 dark:text-brand-300" title={o.name}>{o.code}</p>) : <p className="mt-1 text-xs text-slate-500">livre</p>}
          </div>
        )
      })}
    </div>
  )
}
