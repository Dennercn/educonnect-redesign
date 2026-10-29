import type { ClassSlot, GradeRecord, Situation, Weekday } from '../types'
import { subjects } from '../data/mock'

export const PASSING_GRADE = 7
export const RECOVERY_GRADE = 4
export const MIN_ATTENDANCE = 75

export const weekdays: Weekday[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const weekdayNames: Record<Weekday, string> = {
  Seg: 'Segunda', Ter: 'Terça', Qua: 'Quarta', Qui: 'Quinta', Sex: 'Sexta', Sáb: 'Sábado',
}

/** Média ponderada: N1 40% · N2 40% · Trabalho 20%. Considera apenas notas já lançadas. */
export function average(r: GradeRecord): number | null {
  const parts: [number | null, number][] = [[r.n1, 0.4], [r.n2, 0.4], [r.work, 0.2]]
  const launched = parts.filter((p): p is [number, number] => p[0] !== null)
  if (!launched.length) return null
  const weight = launched.reduce((t, [, w]) => t + w, 0)
  return launched.reduce((t, [v, w]) => t + v * w, 0) / weight
}

export function situation(r: GradeRecord): Situation {
  const avg = average(r)
  const complete = r.n1 !== null && r.n2 !== null && r.work !== null
  if (!complete || avg === null) return 'cursando'
  if (r.attendance < MIN_ATTENDANCE) return 'reprovado'
  if (avg >= PASSING_GRADE) return 'aprovado'
  if (avg >= RECOVERY_GRADE) return 'recuperacao'
  return 'reprovado'
}

/** Disciplina em andamento que precisa de atenção (média parcial ou frequência baixas). */
export function atRisk(r: GradeRecord) {
  const avg = average(r)
  return situation(r) === 'cursando' && ((avg !== null && avg < PASSING_GRADE) || r.attendance < MIN_ATTENDANCE + 5)
}

/** Nota mínima necessária na N2 para atingir a média de aprovação (null se não se aplica). */
export function neededN2(r: GradeRecord): number | null {
  if (r.n2 !== null || r.n1 === null || r.work === null) return null
  return (PASSING_GRADE - 0.4 * r.n1 - 0.2 * r.work) / 0.4
}

/** Média geral ponderada pelos créditos de cada disciplina. */
export function weightedAverage(records: GradeRecord[]) {
  let sum = 0
  let credits = 0
  for (const r of records) {
    const avg = average(r)
    if (avg === null) continue
    const c = subjects[r.code]?.credits ?? 1
    sum += avg * c
    credits += c
  }
  return credits ? sum / credits : null
}

export const formatGrade = (v: number | null) => (v === null ? '—' : v.toFixed(1).replace('.', ','))

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export const slotsOverlap = (a: ClassSlot, b: ClassSlot) =>
  a.day === b.day && toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end)

export const formatSlot = (s: ClassSlot) => `${s.day} · ${s.start}–${s.end}`

export const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', opts).replace('.', '')

export const daysUntil = (iso: string, from = new Date()) => {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const b = new Date(`${iso}T00:00:00`)
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

const jsDayToWeekday: (Weekday | null)[] = [null, 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const todayWeekday = (d = new Date()) => jsDayToWeekday[d.getDay()]
