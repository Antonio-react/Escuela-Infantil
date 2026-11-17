import { useId } from 'react'
import { equipo } from '../../data/equipo'
import { site } from '../../data/site'
import { textos } from '../../data/textos'

// Inicio: "Quiénes somos". Un solo párrafo grande (el momento tipográfico de la página) con los nombres de
// las directoras (de equipo.ts) y los años que lleva abierta la escuela ("más de 20", de site.aniosAbiertaMinimo).

// "Beatriz, Cristina y Olga": las del equipo que son directoras, en el orden de ORDEN_DIRECTORAS (Antonio,
// 2026-11-16: en este texto, Beatriz primero; en el equipo de La escuela siguen en el orden de equipo.ts), unidas como
// en español (Intl.ListFormat).
// formatToParts devuelve los trozos por separado (cada nombre y las uniones ", " e " y "): así cada nombre
// puede llevar su color. Los tres colores de la marca con contraste para texto sobre crema.
const coloresNombre = ['text-verde', 'text-ciruela', 'text-coral'] as const
const ORDEN_DIRECTORAS = ['Beatriz', 'Cristina', 'Olga']
const puesto = (nombre: string) => (ORDEN_DIRECTORAS.includes(nombre) ? ORDEN_DIRECTORAS.indexOf(nombre) : ORDEN_DIRECTORAS.length)
const partesDirectoras = new Intl.ListFormat('es', { type: 'conjunction' }).formatToParts(
  equipo
    .filter((persona) => persona.cargo.startsWith('Directora'))
    .map((persona) => persona.nombre)
    .sort((a, b) => puesto(a) - puesto(b)),
)
function Directoras() {
  let n = 0
  return partesDirectoras.map((parte, i) =>
    parte.type === 'element' ? (
      <span key={i} className={coloresNombre[n++ % coloresNombre.length]}>
        {parte.value}
      </span>
    ) : (
      parte.value
    ),
  )
}

export function Presentacion() {
  const t = textos.secciones.presentacion
  const idTitulo = useId()
  return (
    <section
      aria-labelledby={idTitulo}
      // Solo el texto, centrado: la foto de la fachada va justo encima, en grande (FachadaInicio.tsx).
      className="mx-auto max-w-4xl px-4 py-[clamp(3.5rem,10svh,7rem)] text-center sm:px-6"
    >
      {/* El título no se ve (el texto habla por sí solo), pero lo lee el lector de pantalla: la sección
          sigue teniendo nombre. */}
      <h2 id={idTitulo} className="sr-only">
        {t.titulo}
      </h2>
      <p className="font-titulo text-[clamp(1.6rem,3.6vw,2.4rem)] leading-snug text-balance text-tinta">
        {t.inicio} <Directoras />
        {t.tras}{' '}
        {/* Azul y no verde: el verde ya es el del primer nombre. */}
        <span className="text-arbol-azul-texto">{t.anios(site.aniosAbiertaMinimo)}</span> {t.final}
      </p>
    </section>
  )
}
