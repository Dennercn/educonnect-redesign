import { Fragment, useMemo, useState } from 'react'
import { AlertTriangle, CalendarDays, CheckCircle2, ChevronDown, Clock3, Info, Printer, SearchX, Target, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { semesters, subjects } from '../data/mock'
import { MIN_ATTENDANCE, PASSING_GRADE, RECOVERY_GRADE, atRisk, average, formatGrade, neededN2, situation, weightedAverage } from '../lib/academic'
import { cn } from '../lib/cn'
import type { GradeRecord, Situation } from '../types'
import { Button } from '../components/ui/Button'
import { SituationBadge, situationMeta } from '../components/ui/Badge'
import { Card, EmptyState, PageHeader, ProgressBar, SearchInput, Segmented } from '../components/ui/Misc'

type Filter = 'todas' | Situation

export function Notas() {
  const [semesterId, setSemesterId] = useState(semesters[0].id)
  const [filter, setFilter] = useState<Filter>('todas')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const semester = semesters.find(s => s.id === semesterId)!
  const records = semester.records

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { todas: records.length, cursando: 0, aprovado: 0, recuperacao: 0, reprovado: 0 }
    records.forEach(r => c[situation(r)]++)
    return c
  }, [records])

  const filtered = records.filter(r => {
    const s = subjects[r.code]
    const text = `${s.name} ${s.code} ${s.professor}`.toLowerCase()
    return (filter === 'todas' || situation(r) === filter) && text.includes(query.trim().toLowerCase())
  })

  const avg = weightedAverage(records)
  const best = records.filter(r => average(r) !== null).sort((a, b) => average(b)! - average(a)!)[0]
  const attention = records.filter(r => atRisk(r) || ['recuperacao', 'reprovado'].includes(situation(r))).length
  const credits = records.reduce((t, r) => t + subjects[r.code].credits, 0)

  const filterOptions = (['todas', 'cursando', 'aprovado', 'recuperacao', 'reprovado'] as Filter[])
    .filter(f => f === 'todas' || counts[f] > 0)
    .map(f => ({ value: f, label: f === 'todas' ? 'Todas' : situationMeta[f].label, count: counts[f] }))

  const changeSemester = (id: string) => {
    setSemesterId(id)
    setFilter('todas')
    setExpanded(null)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Boletim"
        title="Notas e boletim"
        description="Acompanhe suas avaliações, médias, frequência e situação em cada disciplina."
        actions={
          <>
            <label className="relative">
              <span className="sr-only">Semestre</span>
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-600 dark:text-brand-400" aria-hidden />
              <select value={semesterId} onChange={e => changeSemester(e.target.value)} className="input h-11 w-auto cursor-pointer appearance-none pl-10 pr-10 font-semibold">
                {semesters.map(s => <option key={s.id} value={s.id}>Semestre {s.id}{s.current ? ' (atual)' : ''}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
            </label>
            <Button variant="secondary" icon={Printer} onClick={() => window.print()} className="print:hidden">Imprimir</Button>
          </>
        }
      />

      <section aria-label="Resumo do semestre" className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Metric icon={TrendingUp} label={semester.current ? 'Média parcial' : 'Média do semestre'} value={formatGrade(avg)} />
        {semester.current ? <Metric icon={Clock3} label="Em andamento" value={`${counts.cursando}/${records.length}`} /> : <Metric icon={CheckCircle2} label="Aprovações" value={`${counts.aprovado}/${records.length}`} />}
        <Metric icon={AlertTriangle} label="Requerem atenção" value={String(attention)} tone={attention ? 'warning' : undefined} />
        <Metric icon={Target} label="Melhor média" value={best ? formatGrade(average(best)) : '—'} detail={best ? subjects[best.code].name : undefined} />
      </section>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <Segmented label="Filtrar por situação" value={filter} onChange={setFilter} options={filterOptions} />
          <SearchInput label="Pesquisar disciplina" value={query} onChange={setQuery} placeholder="Disciplina, código ou professor" className="lg:w-80" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nenhuma disciplina encontrada"
            description="Tente outro termo de busca ou limpe os filtros."
            action={<Button variant="secondary" onClick={() => { setQuery(''); setFilter('todas') }}>Limpar filtros</Button>}
          />
        ) : (
          <>
            {/* Tablet e desktop: tabela */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <caption className="sr-only">Notas do semestre {semester.id}</caption>
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                    <th scope="col" className="px-5 py-3">Disciplina</th>
                    <th scope="col" className="px-3 py-3 text-center">N1</th>
                    <th scope="col" className="px-3 py-3 text-center">N2</th>
                    <th scope="col" className="px-3 py-3 text-center">Trab.</th>
                    <th scope="col" className="px-3 py-3 text-center">Média</th>
                    <th scope="col" className="px-3 py-3 text-center">Freq.</th>
                    <th scope="col" className="px-3 py-3">Situação</th>
                    <th scope="col" className="w-12 px-3 py-3"><span className="sr-only">Detalhes</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((r, i) => {
                    const s = subjects[r.code]
                    const open = expanded === r.code
                    const a = average(r)
                    return (
                      <Fragment key={r.code}>
                        <tr style={{ animationDelay: `${i * 40}ms` }} className={cn('animate-fade-up cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40', open && 'bg-slate-50 dark:bg-slate-800/40')} onClick={() => setExpanded(open ? null : r.code)}>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900 dark:text-white">{s.name}</p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{s.code} · {s.professor}</p>
                          </td>
                          <GradeCell v={r.n1} />
                          <GradeCell v={r.n2} />
                          <GradeCell v={r.work} />
                          <td className="px-3 py-4 text-center">
                            <span className={cn('inline-block min-w-12 rounded-lg px-2 py-1 font-display text-base font-bold tabular-nums', a !== null && a < PASSING_GRADE ? 'bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' : 'text-slate-900 dark:text-white')}>{formatGrade(a)}</span>
                          </td>
                          <td className={cn('px-3 py-4 text-center tabular-nums', r.attendance < MIN_ATTENDANCE ? 'font-semibold text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300')}>{r.attendance}%</td>
                          <td className="px-3 py-4"><SituationBadge value={situation(r)} /></td>
                          <td className="px-3 py-4">
                            <button
                              onClick={e => { e.stopPropagation(); setExpanded(open ? null : r.code) }}
                              aria-expanded={open}
                              aria-label={`${open ? 'Ocultar' : 'Mostrar'} detalhes de ${s.name}`}
                              className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700"
                            >
                              <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
                            </button>
                          </td>
                        </tr>
                        {open && (
                          <tr className="bg-slate-50 dark:bg-slate-800/40">
                            <td colSpan={8} className="px-5 pb-5 pt-1"><Details r={r} /></td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Smartphone: cartões expansíveis */}
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
              {filtered.map((r, i) => {
                const s = subjects[r.code]
                const open = expanded === r.code
                return (
                  <li key={r.code} style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-up">
                    <button onClick={() => setExpanded(open ? null : r.code)} aria-expanded={open} className="flex w-full items-start gap-3 p-4 text-left">
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-slate-900 dark:text-white">{s.name}</span>
                        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{s.code} · Freq. {r.attendance}%</span>
                        <span className="mt-2 block"><SituationBadge value={situation(r)} /></span>
                      </span>
                      <span className="text-right">
                        <span className="block text-xs font-medium text-slate-500">Média</span>
                        <span className="block font-display text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">{formatGrade(average(r))}</span>
                      </span>
                      <ChevronDown className={cn('mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
                    </button>
                    {open && <div className="px-4 pb-4"><Details r={r} /></div>}
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </Card>

      <div className="mt-4 flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden />
        <p>
          <strong className="text-slate-900 dark:text-white">Como a média é calculada:</strong> N1 (40%) + N2 (40%) + Trabalho (20%).
          Aprovação com média ≥ {PASSING_GRADE},0 e frequência ≥ {MIN_ATTENDANCE}%. Média entre {RECOVERY_GRADE},0 e {formatGrade(PASSING_GRADE - 0.1)}: recuperação.
        </p>
      </div>
    </div>
  )
}

function GradeCell({ v }: { v: number | null }) {
  return (
    <td className={cn('px-3 py-4 text-center tabular-nums', v === null ? 'text-slate-500' : 'text-slate-700 dark:text-slate-300')}>
      {v === null ? <span title="Ainda não lançada">—<span className="sr-only">não lançada</span></span> : formatGrade(v)}
    </td>
  )
}

function Details({ r }: { r: GradeRecord }) {
  const s = subjects[r.code]
  const need = neededN2(r)
  const parts: [string, number | null, string][] = [['N1', r.n1, '40%'], ['N2', r.n2, '40%'], ['Trabalho', r.work, '20%']]
  return (
    <div className="grid animate-fade-in gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 lg:grid-cols-[1fr_1fr_1.2fr]">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Composição da média</p>
        {parts.map(([label, v, weight]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">{label} <span className="text-slate-500">· peso {weight}</span></span>
              <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{v === null ? 'Não lançada' : formatGrade(v)}</span>
            </div>
            <ProgressBar value={v ?? 0} max={10} label={`${label}: ${formatGrade(v)}`} />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Frequência</p>
        <p className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{r.attendance}%</p>
        <ProgressBar value={r.attendance} marker={MIN_ATTENDANCE} tone={r.attendance < MIN_ATTENDANCE ? 'danger' : r.attendance < MIN_ATTENDANCE + 5 ? 'warning' : 'success'} label="Frequência" />
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {Math.round((r.classesHeld * (100 - r.attendance)) / 100)} falta(s) em {r.classesHeld} aulas · professor(a) {s.professor}
        </p>
      </div>
      <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/60">
        {need !== null ? (
          need <= 0 ? (
            <p className="text-emerald-800 dark:text-emerald-300"><strong>Aprovação garantida por nota</strong> se mantiver a frequência — qualquer nota na N2 é suficiente.</p>
          ) : need > 10 ? (
            <p className="text-amber-900 dark:text-amber-200"><strong>Não é possível atingir {PASSING_GRADE},0 na N2.</strong> Procure o(a) professor(a) para orientação sobre a recuperação.</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Meta para a N2</p>
              <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-brand-700 dark:text-brand-300">{formatGrade(Math.ceil(need * 10) / 10)}</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">é a nota mínima na N2 para fechar com média {PASSING_GRADE},0.</p>
            </>
          )
        ) : situation(r) === 'recuperacao' ? (
          <p className="text-amber-900 dark:text-amber-200"><strong>Em recuperação.</strong> A prova de recuperação substitui a menor nota. Consulte a data em “Próximos prazos”.</p>
        ) : situation(r) === 'reprovado' ? (
          <p className="text-rose-800 dark:text-rose-300"><strong>Reprovado{r.attendance < MIN_ATTENDANCE ? ' por frequência' : ''}.</strong> A disciplina pode ser cursada novamente na próxima matrícula.</p>
        ) : (
          <p className="text-emerald-800 dark:text-emerald-300"><strong>Disciplina concluída</strong> com média {formatGrade(average(r))}.</p>
        )}
      </div>
    </div>
  )
}

function Metric({ icon: Icon, label, value, detail, tone }: { icon: LucideIcon; label: string; value: string; detail?: string; tone?: 'warning' }) {
  return (
    <div className="card flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
      <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', tone === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' : 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300')}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">{label}</p>
        <p className="font-display text-xl font-extrabold tabular-nums text-slate-900 dark:text-white sm:text-2xl">{value}</p>
        {detail && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{detail}</p>}
      </div>
    </div>
  )
}
