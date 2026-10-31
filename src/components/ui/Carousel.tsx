import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { ArrowRight, BookMarked, CalendarHeart, ChevronLeft, ChevronRight, ClipboardList, Pause, Play, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Highlight, Page } from '../../types'

const icons: Record<Highlight['icon'], LucideIcon> = {
  matricula: ClipboardList,
  monitoria: Users,
  evento: CalendarHeart,
  biblioteca: BookMarked,
}

const INTERVAL = 6000
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Carrossel de destaques acessível (padrão WAI-ARIA "carousel"):
 * troca automática que pausa ao passar o mouse, focar ou tocar; botão de pausa;
 * setas, indicadores, teclado (← →) e gesto de arrastar no celular.
 */
export function Carousel({ slides, onNavigate, label = 'Destaques' }: { slides: Highlight[]; onNavigate: (p: Page) => void; label?: string }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const [drag, setDrag] = useState(0)
  const dragStart = useRef<number | null>(null)
  const count = slides.length

  const go = useCallback((i: number) => setIndex((i + count) % count), [count])
  const running = playing && !hovered && !focused && dragStart.current === null

  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(() => go(index + 1), INTERVAL)
    return () => window.clearTimeout(t)
  }, [running, index, go])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1) }
  }

  // Gesto de arrastar (toque ou mouse)
  const onPointerDown = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    dragStart.current = e.clientX
  }
  const onPointerMove = (e: PointerEvent) => {
    if (dragStart.current !== null) setDrag(e.clientX - dragStart.current)
  }
  const endDrag = () => {
    if (dragStart.current === null) return
    if (drag < -50) go(index + 1)
    else if (drag > 50) go(index - 1)
    dragStart.current = null
    setDrag(0)
  }

  return (
    <section
      aria-roledescription="carrossel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); endDrag() }}
      onFocus={() => setFocused(true)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false) }}
      className="group/carousel relative overflow-hidden rounded-3xl bg-slate-900 shadow-raised"
    >
      <div
        aria-live={running ? 'off' : 'polite'}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn('flex touch-pan-y select-none', dragStart.current === null && 'transition-transform duration-500 ease-[cubic-bezier(.2,.7,.3,1)]')}
        style={{ transform: `translateX(calc(${-index * 100}% + ${drag}px))` }}
      >
        {slides.map((s, i) => {
          const Icon = icons[s.icon]
          const active = i === index
          const hasImage = !failed[s.id]
          return (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${count}: ${s.title}`}
              aria-hidden={!active}
              className={cn('relative h-72 w-full shrink-0 overflow-hidden bg-gradient-to-br sm:h-64 lg:h-72', s.tone)}
            >
              {hasImage ? (
                <img
                  src={s.image}
                  alt=""
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  onError={() => setFailed(f => ({ ...f, [s.id]: true }))}
                  className={cn('absolute inset-0 h-full w-full object-cover transition-transform duration-[6000ms] ease-linear', active && running ? 'scale-105' : 'scale-100')}
                />
              ) : (
                <>
                  <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden />
                  <Icon className="absolute -bottom-6 right-4 h-48 w-48 rotate-[-8deg] text-white/15 sm:right-10 sm:h-56 sm:w-56" strokeWidth={1.25} aria-hidden />
                </>
              )}
              {/* Película escura: garante contraste do texto branco sobre qualquer imagem */}
              <div className={cn('absolute inset-0', hasImage ? 'bg-gradient-to-t from-slate-950/90 via-slate-950/70 to-slate-950/30 sm:bg-gradient-to-r sm:from-slate-950/85 sm:via-slate-950/55 sm:to-slate-950/0' : 'bg-gradient-to-r from-black/30 via-black/10 to-transparent')} aria-hidden />

              <div className={cn('relative flex h-full max-w-xl flex-col justify-end p-6 pb-14 text-white sm:p-8 sm:pb-16', active && 'animate-fade-up')}>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25 backdrop-blur">
                  <Icon className="h-3.5 w-3.5" aria-hidden /> {s.tag}
                </span>
                <h3 className="mt-3 text-xl font-extrabold leading-tight sm:text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-100 sm:text-base">{s.description}</p>
                {s.cta && (
                  <button
                    onClick={() => onNavigate(s.cta!.page)}
                    tabIndex={active ? 0 : -1}
                    className="mt-4 inline-flex h-10 w-fit items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-brand-50 active:scale-[.98]"
                  >
                    {s.cta.label} <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Controles */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-6 pb-4 sm:px-8">
        <div className="flex items-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              aria-label={`Ir para o destaque ${i + 1}: ${s.title}`}
              aria-current={i === index ? 'true' : undefined}
              className="group/dot grid h-6 place-items-center"
            >
              <span className={cn('relative block h-1.5 overflow-hidden rounded-full bg-white/40 transition-all duration-300 group-hover/dot:bg-white/70', i === index ? 'w-8' : 'w-1.5')}>
                {i === index && (
                  <span
                    key={`${index}-${running}`}
                    className={cn('absolute inset-y-0 left-0 rounded-full bg-white', running ? 'animate-[progress_6s_linear_both]' : 'w-full')}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <CarouselButton label={playing ? 'Pausar troca automática' : 'Retomar troca automática'} onClick={() => setPlaying(p => !p)} icon={playing ? Pause : Play} />
          <CarouselButton label="Destaque anterior" onClick={() => go(index - 1)} icon={ChevronLeft} />
          <CarouselButton label="Próximo destaque" onClick={() => go(index + 1)} icon={ChevronRight} />
        </div>
      </div>
    </section>
  )
}

function CarouselButton({ label, onClick, icon: Icon }: { label: string; onClick: () => void; icon: LucideIcon }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/30 active:scale-95"
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  )
}
