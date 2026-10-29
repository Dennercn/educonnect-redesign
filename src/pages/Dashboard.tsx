import { AlertTriangle, ArrowRight, BookOpen, CalendarClock, CalendarDays, CheckCircle2, ClipboardList, Clock3, GraduationCap, MapPin, TrendingUp, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { currentSemester, enrollmentPeriod, events, student, subjects } from '../data/mock'
import { MIN_ATTENDANCE, PASSING_GRADE, atRisk, average, daysUntil, formatDate, formatGrade, situation, weekdayNames, weekdays, weightedAverage } from '../lib/academic'
import { cn } from '../lib/cn'
import type { Page, Subject } from '../types'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardHeader, ProgressBar } from '../components/ui/Misc'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const greeting = (h: number) => (h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite')

/** Próxima aula a partir de agora, procurando nos próximos 7 dias. */
function nextClass(now = new Date()): { subject: Subject; when: string } | null {
  const current = currentSemester.records.map(r => subjects[r.code])
  for (let offset = 0; offset < 7; offset++) {
    const d = new Date(now)
    d.setDate(now.getDate() + offset)
    const dayIdx = d.getDay() - 1
    if (dayIdx < 0) continue
    const day = weekdays[dayIdx]
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    const candidates = current
      .filter(s => s.slot.day === day)
      .filter(s => {
        if (offset > 0) return true
        const [h, m] = s.slot.end.split(':').map(Number)
        return h * 60 + m > nowMinutes
      })
      .sort((a, b) => a.slot.start.localeCompare(b.slot.start))
    if (candidates.length) {
      const when = offset === 0 ? 'Hoje' : offset === 1 ? 'Amanhã' : weekdayNames[day]
      return { subject: candidates[0], when }
    }
  }
  return null
}

export function Dashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { profile, enrollment } = useApp()
  const now = new Date()
  const records = currentSemester.records
  const avg = weightedAverage(records)
  const attendance = records.reduce((t, r) => t + r.attendance, 0) / records.length
  const attention = records.filter(r => atRisk(r) || situation(r) === 'recuperacao')
  const next = nextClass(now)
  const enrolled = enrollment?.semester === enrollmentPeriod.semester
  const daysLeft = daysUntil(enrollmentPeriod.closesAt, now)
  const firstName = (profile.socialName || profile.name).split(' ')[0]

  return (
    <div className="space-y-6">
      {/* Boas-vindas + próxima aula */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-6 text-white shadow-raised shadow-brand-900/20 sm:p-8">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" aria-hidden />
        <div className="absolute -bottom-24 right-40 h-60 w-60 rounded-full bg-accent-400/25 blur-3xl" aria-hidden />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-medium text-brand-100">{capitalize(now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }))}</p>
            <h1 id="page-title" tabIndex={-1} className="mt-1 text-2xl font-extrabold outline-none sm:text-3xl">{greeting(now.getHours())}, {firstName}!</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-brand-100 sm:text-base">
              {student.course} · {student.period} · Semestre {currentSemester.id}.{' '}
              {attention.length ? `${attention.length} disciplina${attention.length > 1 ? 's precisam' : ' precisa'} da sua atenção.` : 'Tudo em dia por aqui.'}
            </p>
          </div>
          {next && (
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur sm:min-w-80">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-100"><CalendarClock className="h-4 w-4" aria-hidden /> Próxima aula · {next.when}</p>
              <p className="mt-2 text-lg font-bold">{next.subject.name}</p>
              <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-50">
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" aria-hidden />{next.subject.slot.start}–{next.subject.slot.end}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden />{next.subject.room}</span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Matrícula: chamada contextual */}
      {enrolled ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10 sm:flex-row sm:items-center sm:p-5">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden />
          <p className="flex-1 text-sm text-emerald-900 dark:text-emerald-200">
            <strong>Matrícula {enrollmentPeriod.semester} confirmada</strong> em {enrollment!.codes.length} disciplinas · protocolo {enrollment!.protocol}.
          </p>
          <Button variant="secondary" size="sm" onClick={() => onNavigate('matricula')}>Ver comprovante</Button>
        </div>
      ) : (
        daysLeft >= 0 && (
          <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10 sm:flex-row sm:items-center sm:p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"><ClipboardList className="h-5 w-5" aria-hidden /></span>
            <div className="flex-1">
              <p className="font-semibold text-amber-950 dark:text-amber-100">Matrícula {enrollmentPeriod.semester} aberta</p>
              <p className="mt-0.5 text-sm text-amber-900 dark:text-amber-200/90">
                {daysLeft === 0 ? 'Último dia' : `Faltam ${daysLeft} dias`} · prazo final em {formatDate(enrollmentPeriod.closesAt, { day: '2-digit', month: 'long' })}.
              </p>
            </div>
            <Button iconRight={ArrowRight} onClick={() => onNavigate('matricula')}>Fazer matrícula</Button>
          </div>
        )
      )}

      {/* Indicadores */}
      <section aria-label="Indicadores do semestre" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat icon={TrendingUp} label="Média parcial" value={formatGrade(avg)} detail={`Mínimo para aprovação: ${PASSING_GRADE},0`} onClick={() => onNavigate('notas')} />
        <Stat icon={CheckCircle2} label="Frequência média" value={`${Math.round(attendance)}%`} detail={`Mínimo exigido: ${MIN_ATTENDANCE}%`} onClick={() => onNavigate('notas')} />
        <Stat icon={GraduationCap} label="Créditos do curso" value={`${student.completedCredits}/${student.totalCredits}`} detail={<ProgressBar value={student.completedCredits} max={student.totalCredits} label="Créditos integralizados" className="mt-1" />} onClick={() => onNavigate('disciplinas')} />
        <Stat icon={AlertTriangle} label="Precisam de atenção" value={String(attention.length)} detail={attention.map(r => subjects[r.code].name.split(' ')[0]).join(', ') || 'Nenhuma'} tone={attention.length ? 'warning' : 'default'} onClick={() => onNavigate('notas')} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        {/* Desempenho por disciplina: uma série, uma cor, valor rotulado */}
        <Card aria-labelledby="perf-title">
          <CardHeader
            id="perf-title"
            title="Desempenho por disciplina"
            description={`Média parcial em ${currentSemester.id} · a linha marca a nota ${PASSING_GRADE},0`}
            action={<Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => onNavigate('notas')}>Boletim</Button>}
          />
          <ul className="space-y-4 p-5 sm:p-6">
            {records.map((r, i) => {
              const a = average(r)
              const s = situation(r)
              const below = a !== null && a < PASSING_GRADE
              return (
                <li key={r.code} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-up" title={`${subjects[r.code].name}: média ${formatGrade(a)}`}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-slate-800 dark:text-slate-200">{subjects[r.code].name}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      {s === 'recuperacao' ? <Badge tone="warning" icon={AlertTriangle}>Recuperação</Badge> : below && <Badge tone="warning" icon={AlertTriangle}>Abaixo da média</Badge>}
                      <span className="w-8 text-right font-semibold tabular-nums text-slate-900 dark:text-white">{formatGrade(a)}</span>
                    </span>
                  </div>
                  <ProgressBar value={a ?? 0} max={10} marker={PASSING_GRADE} label={`Média de ${subjects[r.code].name}`} />
                </li>
              )
            })}
          </ul>
        </Card>

        {/* Agenda */}
        <Card aria-labelledby="agenda-title">
          <CardHeader id="agenda-title" title="Próximos prazos" description="Avaliações, entregas e datas da secretaria" action={<CalendarDays className="h-5 w-5 text-slate-500" aria-hidden />} />
          <ul className="space-y-1 p-3 sm:p-4">
            {events.map(e => {
              const d = daysUntil(e.date, now)
              return (
                <li key={e.title}>
                  <button onClick={() => onNavigate(e.page)} className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <span className={cn('flex w-14 shrink-0 flex-col items-center rounded-xl py-2 font-display leading-none', e.urgent ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300' : 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300')}>
                      <span className="text-lg font-extrabold">{formatDate(e.date, { day: '2-digit' })}</span>
                      <span className="mt-1 text-[11px] font-bold uppercase">{formatDate(e.date, { month: 'short' })}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{e.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-600 dark:text-slate-400">{e.meta}</span>
                    </span>
                    <span className={cn('shrink-0 text-xs font-semibold', d <= 7 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400')}>
                      {d === 0 ? 'hoje' : d === 1 ? 'amanhã' : d > 0 ? `em ${d} dias` : 'encerrado'}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      {/* Atalhos */}
      <section aria-labelledby="shortcuts-title">
        <h2 id="shortcuts-title" className="mb-3 text-base font-bold text-slate-900 dark:text-white">Acesso rápido</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Shortcut icon={GraduationCap} title="Consultar notas" text="Médias e situação" onClick={() => onNavigate('notas')} />
          <Shortcut icon={BookOpen} title="Minhas aulas" text="Grade e professores" onClick={() => onNavigate('disciplinas')} />
          <Shortcut icon={ClipboardList} title="Matrícula" text={enrolled ? 'Ver comprovante' : 'Período aberto'} onClick={() => onNavigate('matricula')} />
          <Shortcut icon={UserRound} title="Meus dados" text="Contato e endereço" onClick={() => onNavigate('perfil')} />
        </div>
      </section>
    </div>
  )
}

function Stat({ icon: Icon, label, value, detail, tone = 'default', onClick }: { icon: LucideIcon; label: string; value: string; detail: ReactNode; tone?: 'default' | 'warning'; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card group p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-raised dark:hover:border-brand-500/40 sm:p-5">
      <span className={cn('grid h-10 w-10 place-items-center rounded-xl', tone === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' : 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300')}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="mt-4 block text-sm text-slate-600 dark:text-slate-400">{label}</span>
      <span className="mt-0.5 block font-display text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white sm:text-3xl">{value}</span>
      <span className="mt-1 block truncate text-xs text-slate-500 dark:text-slate-400">{detail}</span>
    </button>
  )
}

function Shortcut({ icon: Icon, title, text, onClick }: { icon: LucideIcon; title: string; text: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card group flex flex-col gap-3 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-raised dark:hover:border-brand-500/40 sm:flex-row sm:items-center">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-300">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-900 dark:text-white">{title}</span>
        <span className="block truncate text-xs text-slate-600 dark:text-slate-400">{text}</span>
      </span>
      <ArrowRight className="hidden h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600 sm:block" aria-hidden />
    </button>
  )
}
