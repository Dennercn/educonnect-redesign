import { useCallback, useEffect, useState } from 'react'
import type { Page } from '../types'

const pages: Page[] = ['dashboard', 'notas', 'disciplinas', 'matricula', 'perfil']

const read = (): Page => {
  const hash = window.location.hash.replace(/^#\/?/, '') as Page
  return pages.includes(hash) ? hash : 'dashboard'
}

/**
 * Roteamento simples por hash (#/notas, #/perfil...).
 * Permite usar o botão "voltar" do navegador e compartilhar o link de uma tela.
 */
export function useHashRoute() {
  const [page, setPage] = useState<Page>(read)

  useEffect(() => {
    const onChange = () => setPage(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((next: Page) => {
    if (read() === next) window.scrollTo({ top: 0, behavior: 'smooth' })
    else window.location.hash = `/${next}`
  }, [])

  return [page, navigate] as const
}
