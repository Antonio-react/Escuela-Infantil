import { useEffect, useRef, useState } from 'react'
import type { Foto } from '../data/fotos'
import { textos } from '../data/textos'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { IconoCerrar } from './Iconos'
import { LapizFlecha } from './LapizFlecha'

const t = textos.secciones.visorFotos

type VisorFotosProps = {
  fotos: readonly Foto[]
  // La foto que se abre (su posición en "fotos"); null: el visor está cerrado.
  abierta: number | null
  alCerrar: () => void
}

// Visor de fotos a pantalla completa (galería de La escuela y actividades de Familias). <dialog> nativo con
// showModal(), como el del calendario (clase .visor de index.css: fundido al abrir y la página de detrás quieta):
// atrapa el foco, se cierra con Esc o pulsando fuera de la foto y, al cerrar, el foco vuelve a la foto pulsada.
// Las fotos van en una TIRA con desplazamiento horizontal y encaje (scroll-snap): en el móvil se pasan con el dedo,
// con la inercia de siempre; en el ordenador, con los lápices (a los lados si caben; si no, debajo), las flechas del teclado o el
// trackpad. Sin bucle: en la primera no sale "anterior" y en la última no sale "siguiente".
export function VisorFotos({ fotos, abierta, alCerrar }: VisorFotosProps) {
  const visorRef = useRef<HTMLDialogElement>(null)
  const tiraRef = useRef<HTMLDivElement>(null)
  const [actual, setActual] = useState(0)
  const reducido = usePrefersReducedMotion()

  // Abrir: primero el diálogo (hasta entonces la tira no mide nada) y luego, sin animación, a la foto pulsada.
  useEffect(() => {
    const visor = visorRef.current
    const tira = tiraRef.current
    if (abierta === null || !visor || !tira) return
    visor.showModal()
    setActual(abierta)
    // En el siguiente fotograma: justo al mostrarse, el navegador hace su propio encaje inicial (scroll-snap) a la
    // primera foto y deshacía este desplazamiento si iba seguido (a veces se abría la foto equivocada).
    const fotograma = requestAnimationFrame(() => tira.scrollTo({ left: abierta * tira.clientWidth, behavior: 'instant' }))
    return () => cancelAnimationFrame(fotograma)
  }, [abierta])

  // La foto que se ve es la que ocupa la tira (cada una mide justo su ancho).
  // Ojo: con el visor cerrado la tira no se ve y mide 0 de ancho (0 / 0 = NaN): entonces no se calcula nada. Y por si
  // acaso, el resultado siempre dentro del rango de fotos.
  const alDesplazar = () => {
    const tira = tiraRef.current
    if (!tira || tira.clientWidth === 0) return
    const indice = Math.round(tira.scrollLeft / tira.clientWidth)
    setActual(Math.min(Math.max(indice, 0), fotos.length - 1))
  }

  const ir = (paso: number) => {
    const tira = tiraRef.current
    const destino = actual + paso
    if (!tira || destino < 0 || destino >= fotos.length) return
    tira.scrollTo({ left: destino * tira.clientWidth, behavior: reducido ? 'instant' : 'smooth' })
  }

  const cerrar = () => visorRef.current?.close()
  const foto = fotos[actual]
  // Lápices: blancos y redondos como la X. Donde no caben a los lados, debajo de la foto, a ambos lados del título;
  // donde caben (variante flechas-lado de index.css), a los lados de la pantalla. invisible y no quitarlos: así no
  // cambia nada de sitio al llegar a la primera o la última.
  const claseLapiz =
    'group z-10 grid size-14 shrink-0 place-items-center rounded-full bg-white shadow-lg transition-transform duration-150 active:scale-[0.97] flechas-lado:fixed flechas-lado:top-1/2 flechas-lado:size-20 flechas-lado:-translate-y-1/2'

  return (
    <dialog
      ref={visorRef}
      aria-label={t.nombre}
      onClose={alCerrar}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) cerrar()
      }}
      onKeyDown={(evento) => {
        if (evento.key === 'ArrowRight' || evento.key === 'ArrowLeft') {
          evento.preventDefault() // la tira no se desplaza ella sola además
          ir(evento.key === 'ArrowRight' ? 1 : -1)
        }
      }}
      className="visor fixed inset-0 m-0 h-full max-h-none w-full max-w-none flex-col justify-center bg-transparent py-4 backdrop:bg-tinta/90 open:flex sm:py-8"
    >
      <button
        type="button"
        onClick={cerrar}
        aria-label={t.cerrar}
        className="fixed top-3 right-3 z-20 grid size-12 place-items-center rounded-full bg-white text-tinta shadow-lg transition-transform duration-150 active:scale-95 sm:top-5 sm:right-5"
      >
        <IconoCerrar />
      </button>

      <div
        ref={tiraRef}
        onScroll={alDesplazar}
        // Con las flechas debajo, la tira mide lo que la foto (foto, título y lápices, juntos en el centro); si no, ocupa
        // todo el alto libre (con las flechas a los lados).
        className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scrollbar-none flechas-lado:min-h-0 flechas-lado:flex-1"
      >
        {fotos.map((f, i) => (
          // Pulsar en el hueco de alrededor de la foto también cierra.
          <div
            key={f.src}
            onClick={(evento) => {
              if (evento.target === evento.currentTarget) cerrar()
            }}
            className="flex w-full shrink-0 snap-center items-center justify-center px-4 flechas-lado:px-28"
          >
            <img
              src={f.src}
              alt={f.alt}
              width={f.ancho}
              height={f.alto}
              // Las de los lados, en cuanto se acercan; la que se abre, enseguida.
              loading={i === abierta ? 'eager' : 'lazy'}
              decoding="async"
              // En móvil, como mucho el alto de la pantalla menos la X, el título y los lápices.
              className="max-h-[calc(100svh-14rem)] w-auto max-w-full rounded-2xl object-contain select-none flechas-lado:max-h-full"
            />
          </div>
        ))}
      </div>

      {/* Fila de abajo, con un ancho máximo y centrada: con las flechas debajo, quedan cerca del título (en tablet, a
          los bordes de la pantalla quedaban lejísimos) y fijas aunque el título cambie de largo. */}
      <div className="mx-auto mt-4 flex w-full max-w-md items-center justify-between gap-3 px-4 flechas-lado:justify-center">
        <button
          type="button"
          onClick={() => ir(-1)}
          aria-label={t.anterior}
          className={`${claseLapiz} flechas-lado:left-5 ${actual === 0 ? 'invisible' : ''}`}
        >
          <LapizFlecha direccion="anterior" color="var(--color-coral)" className="size-full" />
        </button>
        <div>
          {/* aria-live: al cambiar de foto, el lector de pantalla dice cuál es y en qué número va. */}
          <p aria-live="polite" className="text-center font-titulo text-lg text-white">
            {foto.titulo} <span className="text-white/70">· {t.contador(actual + 1, fotos.length)}</span>
          </p>
          {/* En móvil, puntitos debajo: dicen que hay más fotos a los lados y que se pasan con el dedo. Decoración:
              el contador ya lo dice en texto. */}
          <div aria-hidden="true" className="mt-2 flex justify-center gap-2 flechas-lado:hidden">
            {fotos.map((f, i) => (
              <span key={f.src} className={`size-2 rounded-full transition-colors duration-200 ${i === actual ? 'bg-white' : 'bg-white/35'}`} />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => ir(1)}
          aria-label={t.siguiente}
          className={`${claseLapiz} flechas-lado:right-5 ${actual === fotos.length - 1 ? 'invisible' : ''}`}
        >
          <LapizFlecha direccion="siguiente" color="var(--color-verde)" className="size-full" />
        </button>
      </div>
    </dialog>
  )
}
