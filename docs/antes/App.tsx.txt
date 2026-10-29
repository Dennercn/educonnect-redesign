import { useMemo, useState } from 'react'
import type { ComponentType, FormEvent } from 'react'
import {
  ArrowRight, BookOpen, CalendarDays, Check, ChevronDown, CircleHelp,
  GraduationCap, Home, LogOut, Menu, Pencil, Search, Settings, User,
  UserRound, X, Bell, BarChart3, ClipboardCheck, Clock3, CreditCard,
  FileText, ShieldCheck, Sparkles, TrendingUp, Users, Mail, Phone,
  MapPin, CheckCircle2, AlertCircle, Plus, Trash2
} from 'lucide-react'

type Page = 'dashboard' | 'notas' | 'disciplinas' | 'matricula' | 'perfil'

type NavItem = {
  id: Page
  label: string
  icon: ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'notas', label: 'Notas', icon: BarChart3 },
  { id: 'disciplinas', label: 'Disciplinas', icon: BookOpen },
  { id: 'matricula', label: 'Matrícula', icon: ClipboardCheck },
  { id: 'perfil', label: 'Meu perfil', icon: UserRound },
]

const grades = [
  { name: 'Desenvolvimento Web', code: 'WEB301', grade: 9.4, status: 'Aprovado', professor: 'Marina Costa', color: 'indigo' },
  { name: 'Banco de Dados', code: 'BD204', grade: 8.7, status: 'Aprovado', professor: 'Rafael Mendes', color: 'emerald' },
  { name: 'Engenharia de Software', code: 'ENG210', grade: 8.2, status: 'Aprovado', professor: 'Carla Nunes', color: 'violet' },
  { name: 'UX e Design de Interfaces', code: 'UX110', grade: 9.1, status: 'Aprovado', professor: 'Lucas Alves', color: 'amber' },
  { name: 'Estruturas de Dados', code: 'ED202', grade: 7.6, status: 'Em andamento', professor: 'João Prado', color: 'sky' },
  { name: 'Arquitetura de Computadores', code: 'AC101', grade: 8.0, status: 'Em andamento', professor: 'Ana Lima', color: 'rose' },
]

const subjects = [
  { name: 'Desenvolvimento Web', code: 'WEB301', professor: 'Marina Costa', schedule: 'Seg • 19:00 – 21:00', room: 'Lab 03', credits: 4, progress: 82 },
  { name: 'Banco de Dados', code: 'BD204', professor: 'Rafael Mendes', schedule: 'Ter • 19:00 – 21:00', room: 'Sala 12', credits: 4, progress: 76 },
  { name: 'Engenharia de Software', code: 'ENG210', professor: 'Carla Nunes', schedule: 'Qua • 19:00 – 21:00', room: 'Sala 08', credits: 4, progress: 70 },
  { name: 'UX e Design de Interfaces', code: 'UX110', professor: 'Lucas Alves', schedule: 'Qui • 19:00 – 21:00', room: 'Lab 01', credits: 3, progress: 91 },
  { name: 'Estruturas de Dados', code: 'ED202', professor: 'João Prado', schedule: 'Sex • 19:00 – 21:00', room: 'Lab 02', credits: 4, progress: 61 },
]

const availableSubjects = [
  { name: 'Computação em Nuvem', code: 'CLD310', professor: 'Fernanda Reis', schedule: 'Seg • 21:00 – 23:00', credits: 4, vacancies: 12 },
  { name: 'Segurança da Informação', code: 'SEC320', professor: 'Bruno Dias', schedule: 'Ter • 21:00 – 23:00', credits: 4, vacancies: 7 },
  { name: 'Mobile Development', code: 'MOB305', professor: 'Diego Ramos', schedule: 'Qua • 21:00 – 23:00', credits: 4, vacancies: 15 },
  { name: 'Inteligência Artificial', code: 'IA401', professor: 'Patrícia Melo', schedule: 'Qui • 21:00 – 23:00', credits: 5, vacancies: 4 },
]

const IconButton = ({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) => (
  <button onClick={onClick} aria-label={label} className="focus-ring rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
    {children}
  </button>
)

function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [profileMenu, setProfileMenu] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [semester, setSemester] = useState('2026.2')

  const navigate = (next: Page) => {
    setPage(next)
    setSidebarOpen(false)
    setProfileMenu(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3000)
  }

  const title = useMemo(() => ({
    dashboard: 'Dashboard',
    notas: 'Minhas notas',
    disciplinas: 'Minhas disciplinas',
    matricula: 'Matrícula',
    perfil: 'Meu perfil',
  }[page]), [page])

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar page={page} open={sidebarOpen} onNavigate={navigate} onClose={() => setSidebarOpen(false)} onLogout={() => showToast('Sessão encerrada com sucesso.')} />
      <div className="lg:pl-72">
        <Header
          title={title}
          semester={semester}
          setSemester={setSemester}
          onMenu={() => setSidebarOpen(true)}
          notifications={notifications}
          setNotifications={setNotifications}
          profileMenu={profileMenu}
          setProfileMenu={setProfileMenu}
          onProfile={() => navigate('perfil')}
          onLogout={() => showToast('Sessão encerrada com sucesso.')}
        />
        <main className="mx-auto max-w-[1500px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          {page === 'dashboard' && <Dashboard onNavigate={navigate} onToast={showToast} />}
          {page === 'notas' && <Notas semester={semester} />}
          {page === 'disciplinas' && <Disciplinas />}
          {page === 'matricula' && <Matricula onToast={showToast} />}
          {page === 'perfil' && <Perfil onToast={showToast} />}
        </main>
      </div>
      <MobileNav page={page} onNavigate={navigate} />
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 animate-float-in items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  )
}

function Sidebar({ page, open, onNavigate, onClose, onLogout }: { page: Page; open: boolean; onNavigate: (p: Page) => void; onClose: () => void; onLogout: () => void }) {
  return (
    <>
      {open && <button onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" aria-label="Fechar menu" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 px-5 py-6 text-white transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="text-left">
              <span className="block text-lg font-extrabold tracking-tight">EduConnect</span>
              <span className="block text-xs text-slate-400">Portal acadêmico</span>
            </span>
          </button>
          <IconButton label="Fechar menu" onClick={onClose}><X className="h-5 w-5 text-slate-400" /></IconButton>
        </div>

        <div className="mt-9 px-2 text-[11px] font-bold uppercase tracking-[.18em] text-slate-500">Menu principal</div>
        <nav className="mt-3 space-y-1.5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => onNavigate(id)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${page === id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-950/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
              <Icon className={`h-5 w-5 ${page === id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              {label}
              {id === 'matricula' && <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-amber-950">ABERTA</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-400 font-bold">JS</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">João Silva</p>
                <p className="truncate text-xs text-slate-400">RA 20261234</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Conta protegida
            </div>
          </div>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300">
            <LogOut className="h-5 w-5" /> Sair do sistema
          </button>
        </div>
      </aside>
    </>
  )
}

function Header({ title, semester, setSemester, onMenu, notifications, setNotifications, profileMenu, setProfileMenu, onProfile, onLogout }: {
  title: string; semester: string; setSemester: (v: string) => void; onMenu: () => void; notifications: boolean; setNotifications: (v: boolean) => void; profileMenu: boolean; setProfileMenu: (v: boolean) => void; onProfile: () => void; onLogout: () => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="focus-ring rounded-xl p-2 text-slate-600 lg:hidden" aria-label="Abrir menu"><Menu /></button>
          <div>
            <p className="hidden text-xs font-semibold uppercase tracking-wider text-slate-400 sm:block">Área do aluno</p>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 sm:flex">
            <CalendarDays className="h-4 w-4 text-indigo-500" />
            <select value={semester} onChange={e => setSemester(e.target.value)} className="bg-transparent outline-none">
              <option>2026.2</option><option>2026.1</option><option>2025.2</option>
            </select>
          </label>
          <div className="relative">
            <IconButton label="Notificações" onClick={() => setNotifications(!notifications)}>
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />
            </IconButton>
            {notifications && <NotificationPanel onClose={() => setNotifications(false)} />}
          </div>
          <div className="relative ml-1">
            <button onClick={() => setProfileMenu(!profileMenu)} className="focus-ring flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-extrabold text-white">JS</span>
              <span className="hidden text-left sm:block"><span className="block text-xs font-bold">João Silva</span><span className="block text-[11px] text-slate-400">Aluno</span></span>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>
            {profileMenu && (
              <div className="absolute right-0 mt-2 w-48 animate-float-in overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                <button onClick={onProfile} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-slate-50"><User className="h-4 w-4" /> Meu perfil</button>
                <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"><LogOut className="h-4 w-4" /> Sair</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 mt-2 w-[320px] animate-float-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="font-bold">Notificações</span><button onClick={onClose} className="text-xs font-semibold text-indigo-600">Marcar lidas</button>
      </div>
      <div className="divide-y divide-slate-100">
        <div className="flex gap-3 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600"><ClipboardCheck className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Matrícula aberta</p><p className="mt-0.5 text-xs text-slate-500">Período 2026.2 disponível até 05/09.</p></div></div>
        <div className="flex gap-3 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Nota atualizada</p><p className="mt-0.5 text-xs text-slate-500">Estruturas de Dados recebeu uma nova nota.</p></div></div>
      </div>
    </div>
  )
}

function Dashboard({ onNavigate, onToast }: { onNavigate: (p: Page) => void; onToast: (m: string) => void }) {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-200 sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="relative max-w-2xl animate-fade-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Semestre 2026.2
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Olá, João! <span className="inline-block">👋</span></h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">Acompanhe sua jornada acadêmica em um só lugar. Você está indo muito bem neste semestre.</p>
          <button onClick={() => onNavigate('notas')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-50">Ver meu desempenho <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Média geral" value="8,7" detail="+0,4 vs. semestre anterior" icon={TrendingUp} tone="indigo" />
        <StatCard label="Disciplinas" value="6" detail="24 créditos matriculados" icon={BookOpen} tone="emerald" />
        <StatCard label="Frequência" value="94%" detail="Excelente aproveitamento" icon={Clock3} tone="violet" />
        <StatCard label="Pendências" value="2" detail="1 atividade • 1 matrícula" icon={AlertCircle} tone="amber" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
        <section className="card overflow-hidden animate-fade-up">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
            <div><h3 className="font-extrabold">Ações rápidas</h3><p className="mt-1 text-sm text-slate-500">Acesse o que você mais precisa.</p></div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
            <QuickAction icon={BarChart3} title="Consultar notas" description="Veja seu desempenho" onClick={() => onNavigate('notas')} />
            <QuickAction icon={BookOpen} title="Ver disciplinas" description="Horários e professores" onClick={() => onNavigate('disciplinas')} />
            <QuickAction icon={ClipboardCheck} title="Fazer matrícula" description="Escolha suas disciplinas" badge="Aberta" onClick={() => onNavigate('matricula')} />
            <QuickAction icon={UserRound} title="Atualizar perfil" description="Mantenha seus dados em dia" onClick={() => onNavigate('perfil')} />
          </div>
        </section>

        <section className="card animate-fade-up [animation-delay:100ms]">
          <div className="flex items-center justify-between p-5 sm:p-6">
            <div><h3 className="font-extrabold">Próximos eventos</h3><p className="mt-1 text-sm text-slate-500">Não perca os prazos.</p></div>
            <CalendarDays className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="space-y-1 px-5 pb-5 sm:px-6 sm:pb-6">
            <Event date="02 SET" title="Entrega do projeto Web" meta="Desenvolvimento Web" />
            <Event date="05 SET" title="Fim do período de matrícula" meta="Secretaria acadêmica" urgent />
            <Event date="12 SET" title="Avaliação parcial" meta="Estruturas de Dados" />
          </div>
        </section>
      </div>

      <section className="card">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div><h3 className="font-extrabold">Resumo das notas</h3><p className="mt-1 text-sm text-slate-500">Suas últimas avaliações.</p></div>
          <button onClick={() => onNavigate('notas')} className="self-start text-sm font-bold text-indigo-600 hover:text-indigo-700">Ver todas →</button>
        </div>
        <div className="divide-y divide-slate-100">
          {grades.slice(0, 4).map((g, i) => <GradeRow key={g.code} grade={g} delay={i * 60} />)}
        </div>
      </section>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 sm:flex sm:items-center sm:justify-between sm:p-6">
        <div className="flex gap-3">
          <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm"><CircleHelp className="h-5 w-5" /></div>
          <div><p className="font-bold text-indigo-950">Precisa de ajuda?</p><p className="mt-1 text-sm text-indigo-800/70">Acesse a central de atendimento para tirar dúvidas acadêmicas.</p></div>
        </div>
        <button onClick={() => onToast('Central de ajuda: em breve você poderá abrir um chamado.')} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 sm:mt-0">Central de ajuda</button>
      </section>
    </div>
  )
}

function StatCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: ComponentType<{ className?: string }>; tone: string }) {
  const tones: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  }
  return <div className="card animate-fade-up p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"><div className="flex items-center justify-between"><div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></div><span className="text-xs font-bold text-slate-400">2026.2</span></div><p className="mt-5 text-sm font-medium text-slate-500">{label}</p><p className="mt-1 text-3xl font-extrabold tracking-tight">{value}</p><p className="mt-1 text-xs font-medium text-slate-400">{detail}</p></div>
}

function QuickAction({ icon: Icon, title, description, onClick, badge }: { icon: ComponentType<{ className?: string }>; title: string; description: string; onClick: () => void; badge?: string }) {
  return <button onClick={onClick} className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-md"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-indigo-100 group-hover:text-indigo-600"><Icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="flex items-center gap-2 text-sm font-bold">{title}{badge && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold uppercase text-emerald-700">{badge}</span>}</span><span className="mt-1 block text-xs text-slate-500">{description}</span></span><ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" /></button>
}

function Event({ date, title, meta, urgent }: { date: string; title: string; meta: string; urgent?: boolean }) {
  return <div className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50"><div className={`w-14 shrink-0 rounded-xl px-2 py-2 text-center text-[10px] font-extrabold ${urgent ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>{date}</div><div className="min-w-0"><p className="truncate text-sm font-bold">{title}</p><p className="mt-0.5 truncate text-xs text-slate-500">{meta}</p></div></div>
}

function GradeRow({ grade, delay = 0 }: { grade: typeof grades[number]; delay?: number }) {
  return <div style={{ animationDelay: `${delay}ms` }} className="flex animate-fade-up items-center gap-3 px-5 py-4 sm:px-6"><span className="hidden h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 sm:grid"><BookOpen className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{grade.name}</p><p className="mt-0.5 text-xs text-slate-400">{grade.code} • {grade.professor}</p></div><span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 sm:block">{grade.status}</span><span className="text-lg font-extrabold text-slate-900">{grade.grade.toFixed(1).replace('.', ',')}</span></div>
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">{eyebrow}</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p></div>{action}</div>
}

function Notas({ semester }: { semester: string }) {
  const [filter, setFilter] = useState('Todas')
  const filtered = grades.filter(g => filter === 'Todas' || g.status === filter)
  return <div>
    <PageHeading eyebrow={`Boletim • ${semester}`} title="Acompanhe seu desempenho" description="Consulte suas notas, situação acadêmica e professores de cada disciplina." action={<select value={filter} onChange={e => setFilter(e.target.value)} className="focus-ring rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm"><option>Todas</option><option>Aprovado</option><option>Em andamento</option></select>} />
    <div className="mb-6 grid gap-4 sm:grid-cols-3"><MiniMetric label="Média do semestre" value="8,7" icon={TrendingUp} /><MiniMetric label="Maior nota" value="9,4" icon={BarChart3} /><MiniMetric label="Disciplinas concluídas" value="4 / 6" icon={CheckCircle2} /></div>
    <section className="card overflow-hidden">
      <div className="hidden grid-cols-[1fr_140px_150px_100px] gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 md:grid"><span>Disciplina</span><span>Situação</span><span>Professor</span><span className="text-right">Nota</span></div>
      <div className="divide-y divide-slate-100">{filtered.map((g, i) => (
        <div key={g.code} style={{ animationDelay: `${i * 50}ms` }} className="grid animate-fade-up gap-3 px-5 py-5 md:grid-cols-[1fr_140px_150px_100px] md:items-center md:gap-4 md:px-6">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><BookOpen className="h-5 w-5" /></span><div><p className="font-bold">{g.name}</p><p className="mt-1 text-xs text-slate-400">{g.code}</p></div></div>
          <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-extrabold ${g.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{g.status}</span>
          <span className="text-sm text-slate-600">{g.professor}</span>
          <span className="text-left text-2xl font-extrabold md:text-right">{g.grade.toFixed(1).replace('.', ',')}</span>
        </div>
      ))}</div>
    </section>
  </div>
}

function MiniMetric({ label, value, icon: Icon }: { label: string; value: string; icon: ComponentType<{ className?: string }> }) {
  return <div className="card flex items-center gap-4 p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Icon className="h-5 w-5" /></span><div><p className="text-xs font-semibold text-slate-400">{label}</p><p className="mt-0.5 text-xl font-extrabold">{value}</p></div></div>
}

function Disciplinas() {
  const [search, setSearch] = useState('')
  const list = subjects.filter(s => `${s.name} ${s.code} ${s.professor}`.toLowerCase().includes(search.toLowerCase()))
  return <div>
    <PageHeading eyebrow="Grade curricular" title="Minhas disciplinas" description="Veja seus horários, professores, créditos e andamento das disciplinas." action={<div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar disciplina..." className="focus-ring w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm sm:w-64" /></div>} />
    <div className="grid gap-4 lg:grid-cols-2">
      {list.map((s, i) => <SubjectCard key={s.code} subject={s} delay={i * 60} />)}
    </div>
  </div>
}

function SubjectCard({ subject: s, delay }: { subject: typeof subjects[number]; delay: number }) {
  return <article style={{ animationDelay: `${delay}ms` }} className="card animate-fade-up p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
    <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><BookOpen className="h-5 w-5" /></span><div><h3 className="font-extrabold">{s.name}</h3><p className="mt-1 text-xs font-semibold text-slate-400">{s.code} • {s.credits} créditos</p></div></div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><MoreDots /></button></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2"><Info icon={UserRound} text={s.professor} /><Info icon={CalendarDays} text={s.schedule} /><Info icon={MapPin} text={s.room} /><Info icon={CreditCard} text={`${s.credits} créditos`} /></div>
    <div className="mt-5"><div className="mb-2 flex justify-between text-xs font-bold"><span className="text-slate-500">Progresso do semestre</span><span>{s.progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${s.progress}%` }} /></div></div>
  </article>
}

function MoreDots() { return <span className="flex gap-0.5"><i className="h-1 w-1 rounded-full bg-current" /><i className="h-1 w-1 rounded-full bg-current" /><i className="h-1 w-1 rounded-full bg-current" /></span> }
function Info({ icon: Icon, text }: { icon: ComponentType<{ className?: string }>; text: string }) { return <div className="flex items-center gap-2 text-xs font-medium text-slate-500"><Icon className="h-4 w-4 text-slate-400" />{text}</div> }

function Matricula({ onToast }: { onToast: (m: string) => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (code: string) => setSelected(s => s.includes(code) ? s.filter(x => x !== code) : [...s, code])
  const selectedSubjects = availableSubjects.filter(s => selected.includes(s.code))
  const credits = selectedSubjects.reduce((sum, s) => sum + s.credits, 24)
  const submit = () => {
    if (!selected.length) return onToast('Selecione pelo menos uma disciplina.')
    onToast(`Pré-matrícula realizada com ${selected.length} nova(s) disciplina(s).`)
  }
  return <div>
    <PageHeading eyebrow="Período 2026.2" title="Monte sua grade" description="Selecione as disciplinas desejadas. Você poderá revisar tudo antes de confirmar." action={<span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Matrículas abertas</span>} />
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <section className="space-y-3">
        {availableSubjects.map((s, i) => <label key={s.code} style={{ animationDelay: `${i * 50}ms` }} className={`card flex cursor-pointer items-center gap-4 p-4 transition duration-200 hover:-translate-y-0.5 sm:p-5 ${selected.includes(s.code) ? 'border-indigo-400 ring-2 ring-indigo-100' : ''}`}>
          <input type="checkbox" checked={selected.includes(s.code)} onChange={() => toggle(s.code)} className="sr-only" />
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition ${selected.includes(s.code) ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>{selected.includes(s.code) && <Check className="h-4 w-4" />}</span>
          <span className="min-w-0 flex-1"><span className="block font-bold">{s.name}</span><span className="mt-1 block text-xs text-slate-500">{s.code} • {s.professor} • {s.schedule}</span></span>
          <span className="hidden rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 sm:block">{s.vacancies} vagas</span>
        </label>)}
      </section>
      <aside className="card h-fit p-5 xl:sticky xl:top-24">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><ClipboardCheck className="h-5 w-5" /></span><div><h3 className="font-extrabold">Resumo</h3><p className="text-xs text-slate-400">Sua seleção atual</p></div></div>
        <div className="my-5 space-y-3 border-y border-slate-100 py-5 text-sm"><div className="flex justify-between"><span className="text-slate-500">Disciplinas atuais</span><b>6</b></div><div className="flex justify-between"><span className="text-slate-500">Novas disciplinas</span><b>{selected.length}</b></div><div className="flex justify-between"><span className="text-slate-500">Total de créditos</span><b>{credits}</b></div></div>
        {selected.length > 0 && <div className="mb-4 space-y-2">{selectedSubjects.map(s => <div key={s.code} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"><span className="truncate font-semibold">{s.name}</span><button onClick={() => toggle(s.code)} className="ml-2 text-slate-400 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div>}
        <button onClick={submit} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700">Continuar matrícula <ArrowRight className="ml-1 inline h-4 w-4" /></button>
        <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">A confirmação final será exibida na próxima etapa.</p>
      </aside>
    </div>
  </div>
}

function Perfil({ onToast }: { onToast: (m: string) => void }) {
  const [form, setForm] = useState({ name: 'João Silva', email: 'joao.silva@email.com', phone: '(11) 99999-8888', city: 'São Paulo', course: 'Sistemas de Informação' })
  const update = (key: keyof typeof form, value: string) => setForm(f => ({ ...f, [key]: value }))
  const submit = (e: FormEvent) => { e.preventDefault(); onToast('Perfil atualizado com sucesso!') }
  return <div>
    <PageHeading eyebrow="Conta acadêmica" title="Meu perfil" description="Mantenha seus dados de contato atualizados para receber comunicados importantes." />
    <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[300px_1fr]">
      <section className="card h-fit p-6 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl font-extrabold text-white shadow-xl shadow-indigo-100">JS</div>
        <h3 className="mt-4 font-extrabold">{form.name}</h3><p className="mt-1 text-xs text-slate-400">RA 20261234</p>
        <div className="mt-5 rounded-xl bg-slate-50 p-3 text-left text-xs"><p className="font-bold">Curso</p><p className="mt-1 text-slate-500">{form.course}</p></div>
        <button type="button" onClick={() => onToast('Seletor de foto aberto.')} className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"><Pencil className="mr-2 inline h-4 w-4" /> Alterar foto</button>
      </section>
      <section className="card p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><User className="h-5 w-5" /></span><div><h3 className="font-extrabold">Dados pessoais</h3><p className="text-xs text-slate-400">Informações básicas da sua conta.</p></div></div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Nome completo" icon={User} value={form.name} onChange={v => update('name', v)} />
          <Field label="E-mail" icon={Mail} value={form.email} onChange={v => update('email', v)} type="email" />
          <Field label="Telefone" icon={Phone} value={form.phone} onChange={v => update('phone', v)} />
          <Field label="Cidade" icon={MapPin} value={form.city} onChange={v => update('city', v)} />
        </div>
        <div className="mt-8 flex flex-col justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row"><button type="button" onClick={() => setForm({ name: 'João Silva', email: 'joao.silva@email.com', phone: '(11) 99999-8888', city: 'São Paulo', course: 'Sistemas de Informação' })} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50">Restaurar</button><button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-0.5 hover:bg-indigo-700">Salvar alterações</button></div>
      </section>
    </form>
    <section className="card mt-6 p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"><Settings className="h-5 w-5" /></span><div><h3 className="font-extrabold">Segurança</h3><p className="text-xs text-slate-400">Gerencie as configurações de acesso.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><button onClick={() => onToast('Fluxo de troca de senha iniciado.')} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"><p className="text-sm font-bold">Alterar senha</p><p className="mt-1 text-xs text-slate-500">Atualize sua senha de acesso.</p></button><button onClick={() => onToast('Sua conta está protegida com autenticação segura.')} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"><p className="text-sm font-bold">Sessões ativas</p><p className="mt-1 text-xs text-slate-500">1 dispositivo conectado agora.</p></button></div></section>
  </div>
}

function Field({ label, icon: Icon, value, onChange, type = 'text' }: { label: string; icon: ComponentType<{ className?: string }>; value: string; onChange: (v: string) => void; type?: string }) {
  return <label><span className="mb-2 block text-xs font-bold text-slate-600">{label}</span><span className="relative block"><Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type={type} value={value} onChange={e => onChange(e.target.value)} className="focus-ring w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm font-medium text-slate-800" /></span></label>
}

function MobileNav({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const items = navItems.slice(0, 4)
  return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"><div className="mx-auto flex max-w-lg items-center justify-around">{items.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onNavigate(id)} className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-bold transition ${page === id ? 'text-indigo-600' : 'text-slate-400'}`}><Icon className="h-5 w-5" />{label}</button>)}</div></nav>
}

export default App
