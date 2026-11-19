import { useState, type ReactNode } from 'react'
import { textos } from '../../data/textos'
import { Seccion } from '../Seccion'
import { ComparadorEstaciones } from './ComparadorEstaciones'

// "Instalaciones": aulas climatizadas todo el año (el único dato que tenemos; las fotos irán aquí cuando lleguen).
// Sin panel (Antonio: la caja redondeada quedaba de plantilla): un TERMOSTATO de pared dibujado con CSS (idea de
// Antonio a partir de uno real, sin copiarlo). En su pantalla, el comparador invierno / verano (la ventana del aula:
// fuera cambia todo, dentro siempre a gusto); debajo, tres botones que funcionan: copo (invierno), el grande del
// centro (a medias, a gusto) y sol (verano). Debajo del aparato, la frase aprobada. Solo, centrado y grande (Antonio
// quitó el testimonio de al lado: el termostato se explica solo).

const t = textos.secciones.instalaciones

function Copo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M12 2v20M3.3 7l17.4 10M3.3 17l17.4-10" />
        <path d="M9.5 3.8 12 6l2.5-2.2M9.5 20.2 12 18l2.5 2.2" />
      </g>
    </svg>
  )
}
function Sol({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
// Carita "a gusto" del botón grande.
function Carita({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 14.5c2.2 2.2 5.8 2.2 8 0" />
      <path d="M9 9.5h.01M15 9.5h.01" strokeWidth="3" />
    </svg>
  )
}

// Botón redondo del termostato: plástico blanco con un poco de relieve (degradado y sombra interior). Al pulsar se
// hunde; con ratón, sube un poco. "activo": el que corresponde a la posición de la línea (aria-pressed).
function BotonTermostato({ etiqueta, activo, alPulsar, grande = false, children }: { etiqueta: string; activo: boolean; alPulsar: () => void; grande?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      aria-pressed={activo}
      onClick={alPulsar}
      className={`grid place-items-center rounded-full bg-linear-to-b from-white to-azul-suave shadow-[inset_0_-0.2rem_0.4rem_rgb(43_40_48/0.1),0_0.2rem_0.5rem_rgb(43_40_48/0.15)] ring-1 ring-tinta/10 transition-transform duration-150 ease-salida hover:-translate-y-0.5 active:scale-95 ${grande ? 'size-18 sm:size-20' : 'size-12 sm:size-14'} ${activo ? 'ring-2 ring-tinta/30' : ''}`}
    >
      {children}
    </button>
  )
}

function Termostato() {
  const [linea, setLinea] = useState(50)
  return (
    // El aparato: blanco, marco gris (ring) y esquinas de aparato. Dentro, la pantalla con su borde oscuro fino.
    <div className="rounded-[2.25rem] bg-white p-3 shadow-[0_1.25rem_2.5rem_rgb(43_40_48/0.16)] ring-[6px] ring-tinta/10 sm:p-5">
      <div className="overflow-hidden rounded-2xl bg-tinta/5 p-1.5 ring-1 ring-tinta/15">
        <ComparadorEstaciones linea={linea} alCambiar={setLinea} className="rounded-[0.7rem]" />
      </div>
      <div className="mt-4 flex items-center justify-center gap-8 sm:mt-6 sm:gap-12">
        <BotonTermostato etiqueta={t.botonInvierno} activo={linea === 100} alPulsar={() => setLinea(100)}>
          <Copo className="size-6 text-arbol-azul-texto sm:size-7" />
        </BotonTermostato>
        <BotonTermostato etiqueta={t.botonAGusto} activo={linea === 50} alPulsar={() => setLinea(50)} grande>
          <Carita className="size-8 text-verde sm:size-9" />
        </BotonTermostato>
        <BotonTermostato etiqueta={t.botonVerano} activo={linea === 0} alPulsar={() => setLinea(0)}>
          <Sol className="size-6 text-arbol-naranja-intenso sm:size-7" />
        </BotonTermostato>
      </div>
    </div>
  )
}

export function Instalaciones() {
  return (
    <Seccion
      titulo={
        // "frío" en rojo (coral: la calefacción) y "calor" en azul (el aire acondicionado). Los dos dan contraste de texto.
        <>
          {t.titulo.antes} <span className="text-coral">{t.titulo.frio}</span> {t.titulo.entre}{' '}
          <span className="text-arbol-azul-texto">{t.titulo.calor}</span>
        </>
      }
      colorTitulo="text-arbol-naranja-texto"
    >
      <div className="mx-auto max-w-3xl">
        {/* En pantallas anchas pero bajas (portátil de 13", tablet en horizontal) el termostato, con sus botones, debe
            caber entero en la pantalla junto al título: su ancho se limita también por el alto (svh). Cuenta: la
            pantalla del comparador va a ~1,55:1 y los botones y bordes suman ~155 px; 18rem = título + márgenes + esos
            155 px (el menú no cuenta: al bajar hasta aquí el header se esconde, useHeaderEscondido). Nunca menos de
            20rem (móvil en horizontal). */}
        <div className="mx-auto w-full max-w-[max(20rem,calc((100svh-18rem)*1.55+3.25rem))]">
          <Termostato />
        </div>
      </div>
    </Seccion>
  )
}
