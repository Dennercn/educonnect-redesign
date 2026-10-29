// Dados fictícios para demonstração. Não há backend.
import type { AppNotification, Highlight, Offering, Profile, SemesterData, Subject } from '../types'

export const student = {
  ra: '20261234',
  course: 'Sistemas de Informação',
  campus: 'Campus Centro',
  shift: 'Noturno',
  period: '4º período',
  entry: '2025.1',
  totalCredits: 160,
  completedCredits: 68,
}

export const initialProfile: Profile = {
  name: 'João Silva',
  socialName: '',
  email: 'joao.silva@email.com',
  phone: '(11) 99999-8888',
  birthDate: '2003-04-12',
  cpf: '123.456.789-09',
  cep: '01310-100',
  address: 'Av. Paulista, 1000 — apto 52',
  city: 'São Paulo',
  state: 'SP',
}

const subjectList: Subject[] = [
  // 2026.2 (semestre atual)
  { code: 'WEB301', name: 'Desenvolvimento Web', professor: 'Marina Costa', professorEmail: 'marina.costa@educonnect.edu', room: 'Lab 03', credits: 4, workload: 80, slot: { day: 'Seg', start: '19:00', end: '20:40' } },
  { code: 'AC101', name: 'Arquitetura de Computadores', professor: 'Ana Lima', professorEmail: 'ana.lima@educonnect.edu', room: 'Sala 05', credits: 4, workload: 80, slot: { day: 'Seg', start: '21:00', end: '22:40' } },
  { code: 'BD204', name: 'Banco de Dados', professor: 'Rafael Mendes', professorEmail: 'rafael.mendes@educonnect.edu', room: 'Sala 12', credits: 4, workload: 80, slot: { day: 'Ter', start: '19:00', end: '20:40' } },
  { code: 'ENG210', name: 'Engenharia de Software', professor: 'Carla Nunes', professorEmail: 'carla.nunes@educonnect.edu', room: 'Sala 08', credits: 4, workload: 80, slot: { day: 'Qua', start: '19:00', end: '20:40' } },
  { code: 'UX110', name: 'UX e Design de Interfaces', professor: 'Lucas Alves', professorEmail: 'lucas.alves@educonnect.edu', room: 'Lab 01', credits: 3, workload: 60, slot: { day: 'Qui', start: '19:00', end: '21:30' } },
  { code: 'ED202', name: 'Estruturas de Dados', professor: 'João Prado', professorEmail: 'joao.prado@educonnect.edu', room: 'Lab 02', credits: 4, workload: 80, slot: { day: 'Sex', start: '19:00', end: '20:40' } },
  // 2026.1
  { code: 'POO201', name: 'Programação Orientada a Objetos', professor: 'Marina Costa', professorEmail: 'marina.costa@educonnect.edu', room: 'Lab 03', credits: 4, workload: 80, slot: { day: 'Seg', start: '19:00', end: '20:40' } },
  { code: 'RED150', name: 'Redes de Computadores', professor: 'Bruno Dias', professorEmail: 'bruno.dias@educonnect.edu', room: 'Sala 10', credits: 4, workload: 80, slot: { day: 'Ter', start: '19:00', end: '20:40' } },
  { code: 'MAT120', name: 'Cálculo I', professor: 'Helena Rocha', professorEmail: 'helena.rocha@educonnect.edu', room: 'Sala 02', credits: 4, workload: 80, slot: { day: 'Qua', start: '19:00', end: '20:40' } },
  { code: 'SO220', name: 'Sistemas Operacionais', professor: 'Ana Lima', professorEmail: 'ana.lima@educonnect.edu', room: 'Lab 04', credits: 4, workload: 80, slot: { day: 'Qui', start: '19:00', end: '20:40' } },
  { code: 'EST130', name: 'Estatística Aplicada', professor: 'Helena Rocha', professorEmail: 'helena.rocha@educonnect.edu', room: 'Sala 02', credits: 3, workload: 60, slot: { day: 'Sex', start: '19:00', end: '20:40' } },
  // 2025.2
  { code: 'ALG101', name: 'Algoritmos e Lógica', professor: 'João Prado', professorEmail: 'joao.prado@educonnect.edu', room: 'Lab 02', credits: 4, workload: 80, slot: { day: 'Seg', start: '19:00', end: '20:40' } },
  { code: 'FSI100', name: 'Fundamentos de SI', professor: 'Carla Nunes', professorEmail: 'carla.nunes@educonnect.edu', room: 'Sala 08', credits: 3, workload: 60, slot: { day: 'Ter', start: '19:00', end: '20:40' } },
  { code: 'MD110', name: 'Matemática Discreta', professor: 'Helena Rocha', professorEmail: 'helena.rocha@educonnect.edu', room: 'Sala 02', credits: 4, workload: 80, slot: { day: 'Qua', start: '19:00', end: '20:40' } },
  { code: 'COM100', name: 'Comunicação e Expressão', professor: 'Paula Freitas', professorEmail: 'paula.freitas@educonnect.edu', room: 'Sala 01', credits: 2, workload: 40, slot: { day: 'Qui', start: '19:00', end: '20:40' } },
]

export const subjects: Record<string, Subject> = Object.fromEntries(subjectList.map(s => [s.code, s]))

export const semesters: SemesterData[] = [
  {
    id: '2026.2',
    current: true,
    records: [
      { code: 'WEB301', n1: 9.2, n2: null, work: 9.5, attendance: 96, classesHeld: 26, progress: 72 },
      { code: 'AC101', n1: 7.8, n2: null, work: 8.0, attendance: 88, classesHeld: 26, progress: 70 },
      { code: 'BD204', n1: 8.6, n2: null, work: 8.8, attendance: 92, classesHeld: 25, progress: 68 },
      { code: 'ENG210', n1: 6.4, n2: null, work: 7.5, attendance: 84, classesHeld: 25, progress: 66 },
      { code: 'UX110', n1: 9.6, n2: null, work: 9.0, attendance: 100, classesHeld: 24, progress: 75 },
      { code: 'ED202', n1: 4.8, n2: 5.6, work: 6.0, attendance: 78, classesHeld: 26, progress: 81 },
    ],
  },
  {
    id: '2026.1',
    current: false,
    records: [
      { code: 'POO201', n1: 8.5, n2: 9.0, work: 9.2, attendance: 94, classesHeld: 40, progress: 100 },
      { code: 'RED150', n1: 7.0, n2: 7.6, work: 8.0, attendance: 90, classesHeld: 40, progress: 100 },
      { code: 'MAT120', n1: 3.0, n2: 4.0, work: 5.0, attendance: 81, classesHeld: 40, progress: 100 },
      { code: 'SO220', n1: 7.9, n2: 8.3, work: 7.5, attendance: 87, classesHeld: 40, progress: 100 },
      { code: 'EST130', n1: 8.8, n2: 8.1, work: 9.0, attendance: 97, classesHeld: 30, progress: 100 },
    ],
  },
  {
    id: '2025.2',
    current: false,
    records: [
      { code: 'ALG101', n1: 9.0, n2: 9.4, work: 10, attendance: 98, classesHeld: 40, progress: 100 },
      { code: 'FSI100', n1: 8.0, n2: 7.4, work: 8.5, attendance: 92, classesHeld: 30, progress: 100 },
      { code: 'MD110', n1: 7.2, n2: 6.8, work: 7.0, attendance: 85, classesHeld: 40, progress: 100 },
      { code: 'COM100', n1: 8.0, n2: 7.0, work: 9.0, attendance: 70, classesHeld: 20, progress: 100 },
    ],
  },
]

export const currentSemester = semesters.find(s => s.current)!

export const enrollmentPeriod = {
  semester: '2027.1',
  opensAt: '2026-10-20',
  closesAt: '2026-11-20',
  minCredits: 12,
  maxCredits: 24,
}

export const offerings: Offering[] = [
  { code: 'CLD310', name: 'Computação em Nuvem', professor: 'Fernanda Reis', professorEmail: 'fernanda.reis@educonnect.edu', room: 'Lab 05', credits: 4, workload: 80, slot: { day: 'Seg', start: '19:00', end: '20:40' }, vacancies: 12, totalVacancies: 40, description: 'Arquiteturas em nuvem, contêineres, serviços gerenciados e implantação contínua.' },
  { code: 'MOB305', name: 'Desenvolvimento Mobile', professor: 'Diego Ramos', professorEmail: 'diego.ramos@educonnect.edu', room: 'Lab 03', credits: 4, workload: 80, slot: { day: 'Seg', start: '19:00', end: '20:40' }, vacancies: 15, totalVacancies: 35, description: 'Aplicativos multiplataforma com React Native, publicação e boas práticas de UX mobile.' },
  { code: 'SEC320', name: 'Segurança da Informação', professor: 'Bruno Dias', professorEmail: 'bruno.dias@educonnect.edu', room: 'Sala 10', credits: 4, workload: 80, slot: { day: 'Ter', start: '19:00', end: '20:40' }, vacancies: 3, totalVacancies: 40, description: 'Criptografia, gestão de riscos, OWASP Top 10 e resposta a incidentes.' },
  { code: 'GP330', name: 'Gestão de Projetos', professor: 'Carla Nunes', professorEmail: 'carla.nunes@educonnect.edu', room: 'Sala 08', credits: 3, workload: 60, slot: { day: 'Qua', start: '19:00', end: '21:30' }, vacancies: 20, totalVacancies: 45, description: 'Metodologias ágeis, Scrum, Kanban, estimativas e comunicação com stakeholders.' },
  { code: 'IA401', name: 'Inteligência Artificial', professor: 'Patrícia Melo', professorEmail: 'patricia.melo@educonnect.edu', room: 'Lab 06', credits: 4, workload: 80, slot: { day: 'Qui', start: '19:00', end: '20:40' }, vacancies: 8, totalVacancies: 35, prerequisite: 'ED202', description: 'Busca, aprendizado de máquina, redes neurais e ética em IA.' },
  { code: 'IHC340', name: 'Interação Humano-Computador', professor: 'Lucas Alves', professorEmail: 'lucas.alves@educonnect.edu', room: 'Lab 01', credits: 3, workload: 60, slot: { day: 'Qui', start: '19:00', end: '21:30' }, vacancies: 0, totalVacancies: 30, description: 'Avaliação de usabilidade, acessibilidade digital e pesquisa com usuários.' },
  { code: 'MAT120', name: 'Cálculo I (reoferta)', professor: 'Helena Rocha', professorEmail: 'helena.rocha@educonnect.edu', room: 'Sala 02', credits: 4, workload: 80, slot: { day: 'Sex', start: '19:00', end: '20:40' }, vacancies: 18, totalVacancies: 40, description: 'Reoferta para alunos com pendência: limites, derivadas e integrais.' },
  { code: 'TCC400', name: 'Projeto Integrador', professor: 'Marina Costa', professorEmail: 'marina.costa@educonnect.edu', room: 'Lab 03', credits: 4, workload: 80, slot: { day: 'Sáb', start: '08:00', end: '11:40' }, vacancies: 22, totalVacancies: 30, description: 'Desenvolvimento de um produto de software completo em equipe, com orientação.' },
]

export const events = [
  { date: '2026-11-03', title: 'Entrega do projeto Web', meta: 'Desenvolvimento Web · Lab 03', page: 'disciplinas' as const, urgent: false },
  { date: '2026-11-10', title: 'Avaliação N2', meta: 'Banco de Dados · Sala 12', page: 'notas' as const, urgent: false },
  { date: '2026-11-20', title: 'Fim do prazo de matrícula 2027.1', meta: 'Secretaria acadêmica', page: 'matricula' as const, urgent: true },
  { date: '2026-11-24', title: 'Prova de recuperação', meta: 'Estruturas de Dados · Lab 02', page: 'notas' as const, urgent: true },
]

export const initialNotifications: AppNotification[] = [
  { id: 'n1', title: 'Matrícula 2027.1 aberta', description: 'Escolha suas disciplinas até 20/11.', time: 'há 2 h', page: 'matricula', read: false, kind: 'warning' },
  { id: 'n2', title: 'Nova nota publicada', description: 'Estruturas de Dados — N2: 5,6.', time: 'ontem', page: 'notas', read: false, kind: 'info' },
  { id: 'n3', title: 'Perfil verificado', description: 'Seus dados de contato estão atualizados.', time: 'há 3 dias', page: 'perfil', read: true, kind: 'success' },
]

// Destaques do carrossel da tela inicial. As imagens ficam em public/images/carrossel/
// (geradas com o Nano Banana; prompts em docs/PROMPTS-NANO-BANANA.md). Sem imagem, o
// carrossel mostra o gradiente e o ícone do destaque.
export const highlights: Highlight[] = [
  {
    id: 'matricula',
    tag: 'Matrícula 2027.1',
    title: 'Monte sua grade do próximo semestre',
    description: 'Período aberto até 20/11. Conflitos de horário e pré-requisitos são verificados automaticamente.',
    image: '/images/carrossel/01-matricula.png',
    icon: 'matricula',
    tone: 'from-brand-700 to-brand-500',
    cta: { label: 'Fazer matrícula', page: 'matricula' },
  },
  {
    id: 'monitoria',
    tag: 'Monitoria',
    title: 'Plantão de Estruturas de Dados',
    description: 'Terças e quintas, das 18h às 19h, no Lab 02. Ideal para se preparar para a recuperação de 24/11.',
    image: '/images/carrossel/02-monitoria.png',
    icon: 'monitoria',
    tone: 'from-accent-700 to-accent-500',
    cta: { label: 'Ver minhas notas', page: 'notas' },
  },
  {
    id: 'semana',
    tag: 'Evento · 17 a 21/11',
    title: 'Semana Acadêmica de Tecnologia',
    description: 'Palestras, oficinas e hackathon no auditório central. Participação conta como horas complementares.',
    image: '/images/carrossel/03-semana-academica.png',
    icon: 'evento',
    tone: 'from-violet-700 to-fuchsia-600',
  },
  {
    id: 'biblioteca',
    tag: 'Biblioteca digital',
    title: 'Mais de 12 mil e-books, 24 horas por dia',
    description: 'Acesse livros-texto das suas disciplinas com o seu RA, no computador ou no celular.',
    image: '/images/carrossel/04-biblioteca.png',
    icon: 'biblioteca',
    tone: 'from-sky-700 to-sky-500',
  },
]
