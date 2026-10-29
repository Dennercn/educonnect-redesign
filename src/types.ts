export type Page = 'dashboard' | 'notas' | 'disciplinas' | 'matricula' | 'perfil'

export type Weekday = 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb'

export interface ClassSlot {
  day: Weekday
  start: string // HH:MM
  end: string
}

export interface Subject {
  code: string
  name: string
  professor: string
  professorEmail: string
  room: string
  credits: number
  workload: number // horas
  slot: ClassSlot
}

export interface GradeRecord {
  code: string
  n1: number | null
  n2: number | null
  work: number | null
  attendance: number // %
  classesHeld: number
  progress: number // % do conteúdo concluído
}

export interface SemesterData {
  id: string
  current: boolean
  records: GradeRecord[]
}

export type Situation = 'aprovado' | 'recuperacao' | 'reprovado' | 'cursando'

export interface Offering extends Subject {
  vacancies: number
  totalVacancies: number
  prerequisite?: string
  description: string
}

export interface Profile {
  name: string
  socialName: string
  email: string
  phone: string
  birthDate: string
  cpf: string
  cep: string
  address: string
  city: string
  state: string
}

export interface Enrollment {
  semester: string
  codes: string[]
  protocol: string
  confirmedAt: string
}

export interface AppNotification {
  id: string
  title: string
  description: string
  time: string
  page: Page
  read: boolean
  kind: 'info' | 'success' | 'warning'
}
