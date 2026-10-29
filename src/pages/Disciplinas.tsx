import { useState } from 'react'
import type { ReactNode } from 'react'
import { BookOpen, CalendarDays, Clock3, LayoutGrid, Mail, MapPin, SearchX, UserRound } from 'lucide-react'
import { currentSemester, subjects } from '../data/mock'
import { MIN_ATTENDANCE, average, formatGrade, formatSlot, situation, todayWeekday, weekdayNames, weekdays } from '../lib/academic'
import { cn } from '../lib/cn'
import type { GradeRecord, Subject } from '../types'
import { Badge, SituationBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { Card, EmptyState, PageHeader, ProgressBar, SearchInput, Segmented } from '../components/ui/Misc'

type View = 'cards' | 'week'

const items = currentSemester.records.map(r => ({ record: r, subject: subjects[r.code] }))

export function Disciplinas() {
  const [view, setView] = useState<View>('cards')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const today = todayWeekday()

  const list = items.filter(({ subject: s }) => `${s.name} ${s.code} ${s.professor} ${s.room}`.toLowerCase().includes(query.trim().toLowerCase()))
  const totalCredits = items.reduce((t, i) => t + i.subject.credits, 0)
  const totalHours = items.reduce((t, i) => t + i.subject.workload, 0)
  const detail = items.find(i => i.subject.code === selected)

  return (
    <div>
      <PageHeader
        eyebrow={`Semestre ${currentSemester.id}`}
        title="Minhas disciplinas"
        description={`${items.length} disciplinas · ${totalCredits} créditos · ${totalHours} horas. Veja professores, salas e horários.`}
        actions={
          <Segmented
            label="Modo de visualização"
            value={view}
            onChange={setView}
            options={[
              { value: 'cards', label: 'Cartões', icon: LayoutGrid },
              { value: 'week', label: 'Grade semanal', icon: CalendarDays },
            ]}
          />
        }
      />

      {view === 'cards' ? (
        <>
          <SearchInput label="Pesquisar disciplina" value={query} onChange={setQuery} placeholder="Buscar por disciplina, professor ou sala" className="mb-5 sm:max-w-md" />
          {list.length === 0 ? (
            <Card><EmptyState icon={SearchX} title="Nenhuma disciplina encontrada" description={`Não há resultados para “${query}”.`} action={<Button variant="secondary" onClick={() => setQuery('')}>Limpar busca</Button>} /></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {list.map(({ subject: s, record: r }, i) => (
                <article key={s.code} style={{ animationDelay: `${i * 50}ms` }} className="card group flex animate-fade-up flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"><BookOpen className="h-5 w-5" aria-hidden /></span>
                    {s.slot.day === today ? <Badge tone="brand" icon={Clock3}>Aula hoje</Badge> : <span className="text-xs font-medium text-slate-500">{s.code}</span>}
                  </div>
                  <h2 className="mt-4 text-lg font-bold leading-snug text-slate-900 dark:text-white">{s.name}</h2>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{s.credits} créditos · {s.workload} h</p>

                  <dl className="mt-4 space-y-2.5 text-sm">
                    <InfoRow icon={UserRound} label="Professor(a)">{s.professor}</InfoRow>
                    <InfoRow icon={CalendarDays} label="Horário">{weekdayNames[s.slot.day]}, {s.slot.start}–{s.slot.end}</InfoRow>
                    <InfoRow icon={MapPin} label="Sala">{s.room}</InfoRow>
                  </dl>

                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-600 dark:text-slate-400">Conteúdo concluído</span><span className="font-semibold tabular-nums">{r.progress}%</span></div>
                      <ProgressBar value={r.progress} label={`Conteúdo concluído em ${s.name}`} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Frequência</span>
                      <span className={cn('font-semibold tabular-nums', r.attendance < MIN_ATTENDANCE + 5 && 'text-amber-800 dark:text-amber-300')}>{r.attendance}%</span>
                    </div>
                  </div>

                  <Button variant="subtle" size="sm" className="mt-5 w-full" onClick={() => setSelected(s.code)}>Ver detalhes</Button>
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        <WeekView today={today} onSelect={setSelected} />
      )}

      <Dialog
        open={!!detail}
        onClose={() => setSelected(null)}
        title={detail?.subject.name ?? ''}
        description={detail && `${detail.subject.code} · ${detail.subject.credits} créditos · ${detail.subject.workload} horas`}
        size="md"
        footer={
          detail && (
            <>
              <Button variant="secondary" onClick={() => setSelected(null)}>Fechar</Button>
              <a href={`mailto:${detail.subject.professorEmail}?subject=${encodeURIComponent(`[${detail.subject.code}] Dúvida`)}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500">
                <Mail className="h-4 w-4" aria-hidden /> Enviar e-mail ao professor
              </a>
            </>
          )
        }
      >
        {detail && <SubjectDetail subject={detail.subject} record={detail.record} />}
      </Dialog>
    </div>
  )
}

function InfoRow({ icon: Icon, label, children }: { icon: typeof BookOpen; label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
      <dt className="sr-only">{label}</dt>
      <dd className="truncate text-slate-700 dark:text-slate-300">{children}</dd>
    </div>
  )
}

function SubjectDetail({ subject: s, record: r }: { subject: Subject; record: GradeRecord }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['Professor(a)', s.professor],
          ['E-mail', s.professorEmail],
          ['Horário', formatSlot(s.slot)],
          ['Sala', s.room],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <p className="text-xs text-slate-500 dark:text-slate-400">{k}</p>
            <p className="mt-0.5 break-words text-sm font-semibold text-slate-900 dark:text-white">{v}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Média parcial · frequência</p>
          <p className="mt-0.5 font-display text-xl font-bold tabular-nums">{formatGrade(average(r))} · {r.attendance}%</p>
        </div>
        <SituationBadge value={situation(r)} />
      </div>
    </div>
  )
}

function WeekView({ today, onSelect }: { today: ReturnType<typeof todayWeekday>; onSelect: (code: string) => void }) {
  const days = weekdays.filter(d => d !== 'Sáb' || items.some(i => i.subject.slot.day === 'Sáb'))
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {days.map((day, i) => {
        const classes = items.filter(it => it.subject.slot.day === day).sort((a, b) => a.subject.slot.start.localeCompare(b.subject.slot.start))
        const isToday = day === today
        return (
          <section key={day} style={{ animationDelay: `${i * 50}ms` }} aria-label={weekdayNames[day]} className={cn('card animate-fade-up p-3', isToday && 'ring-2 ring-brand-500 dark:ring-brand-400')}>
            <h2 className="mb-3 flex items-center justify-between px-1 text-sm font-bold text-slate-900 dark:text-white">
              {weekdayNames[day]}
              {isToday && <Badge tone="brand">Hoje</Badge>}
            </h2>
            <ul className="space-y-2">
              {classes.length === 0 && <li className="rounded-xl border border-dashed border-slate-200 p-3 text-center text-xs text-slate-500 dark:border-slate-700">Sem aulas</li>}
              {classes.map(({ subject: s }) => (
                <li key={s.code}>
                  <button onClick={() => onSelect(s.code)} className="w-full rounded-xl border-l-4 border-brand-500 bg-brand-50/70 p-3 text-left transition-colors hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20">
                    <span className="block text-xs font-semibold tabular-nums text-brand-800 dark:text-brand-300">{s.slot.start}–{s.slot.end}</span>
                    <span className="mt-1 block text-sm font-semibold leading-snug text-slate-900 dark:text-white">{s.name}</span>
                    <span className="mt-1 block text-xs text-slate-600 dark:text-slate-400">{s.room} · {s.professor}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
