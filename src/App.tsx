import { useEffect, useRef, useState } from 'react'
import { LogOut } from 'lucide-react'
import { AppProvider, useApp } from './context/AppContext'
import { ToastProvider, useToast } from './context/ToastContext'
import { useHashRoute } from './hooks/useHashRoute'
import { Header } from './components/layout/Header'
import { MobileNav } from './components/layout/MobileNav'
import { Sidebar } from './components/layout/Sidebar'
import { pageTitles } from './components/layout/nav'
import { Button } from './components/ui/Button'
import { Dialog } from './components/ui/Dialog'
import { Dashboard } from './pages/Dashboard'
import { Disciplinas } from './pages/Disciplinas'
import { Login } from './pages/Login'
import { Matricula } from './pages/Matricula'
import { Notas } from './pages/Notas'
import { Perfil } from './pages/Perfil'

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </AppProvider>
  )
}

function Shell() {
  const { loggedIn, setLoggedIn, profile } = useApp()
  const notify = useToast()
  const [page, navigate] = useHashRoute()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const firstRender = useRef(true)

  // Ao trocar de tela: título da aba, rolagem ao topo e foco no título (leitores de tela anunciam a nova página)
  useEffect(() => {
    document.title = `${pageTitles[page]} · EduConnect`
    if (firstRender.current) { firstRender.current = false; return }
    window.scrollTo({ top: 0 })
    requestAnimationFrame(() => document.getElementById('page-title')?.focus({ preventScroll: true }))
  }, [page])

  const confirmLogout = async () => {
    setLoggingOut(true)
    await new Promise(r => setTimeout(r, 700))
    setLoggingOut(false)
    setLogoutOpen(false)
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return (
      <Login
        onLogin={() => {
          setLoggedIn(true)
          navigate('dashboard')
          notify(`Bem-vindo de volta, ${(profile.socialName || profile.name).split(' ')[0]}!`)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen">
      <button
        onClick={() => document.getElementById('conteudo')?.focus()}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-600 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </button>

      <Sidebar page={page} onNavigate={navigate} onLogout={() => setLogoutOpen(true)} />

      <div className="md:pl-20 lg:pl-72 print:!pl-0">
        <Header page={page} onNavigate={navigate} onLogout={() => setLogoutOpen(true)} />
        <main id="conteudo" tabIndex={-1} key={page} className="mx-auto max-w-7xl animate-fade-up px-4 pb-28 pt-6 outline-none sm:px-6 md:pb-12 lg:px-8 lg:pt-8">
          {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {page === 'notas' && <Notas />}
          {page === 'disciplinas' && <Disciplinas />}
          {page === 'matricula' && <Matricula onNavigate={navigate} />}
          {page === 'perfil' && <Perfil />}
        </main>
      </div>

      <MobileNav page={page} onNavigate={navigate} />

      <Dialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        locked={loggingOut}
        size="sm"
        title="Sair do EduConnect?"
        description="Sua sessão será encerrada neste dispositivo. Alterações já salvas não serão perdidas."
        icon={<span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"><LogOut className="h-6 w-6" aria-hidden /></span>}
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogoutOpen(false)} disabled={loggingOut} data-autofocus>Continuar conectado</Button>
            <Button variant="danger" icon={LogOut} onClick={confirmLogout} loading={loggingOut}>{loggingOut ? 'Saindo...' : 'Sair'}</Button>
          </>
        }
      />
    </div>
  )
}
