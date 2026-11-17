import type { CSSProperties } from 'react'
import { textos } from '../data/textos'
import { Bloque, Fresa, Mochila, Osito, Patito } from './Juguetes'

// Tarjeta de un testimonio de una familia, con forma de reseña (Antonio, 2026-11-16, con referencias de reseñas en
// tarjetas apiladas): arriba, un "avatar" y el autor; debajo, el texto real. Sustituye a la tarjeta que colgaba de
// una rama ("la línea con luces" no le gustaba).
// Normas de CLAUDE.md: sin nombre ni foto (el avatar es un juguete de la escuela, no una persona; el autor es
// genérico), sin estrellas ni logo de Google en la tarjeta (solo el texto "Reseña en Google"). El texto, tal cual.
// indice: elige el juguete, el color del avatar y el fondo de la tarjeta (se alternan blanco y colores suaves del
// árbol, como en la referencia), para que cada una sea distinta.

// La mochila y la fresa, como los dibujos de las ventanas de las aulas (Antonio, 2026-11-16).
const avatares = [
  { Juguete: Osito, fondo: 'var(--color-arbol-naranja)' },
  { Juguete: Patito, fondo: 'var(--color-arbol-azul)' },
  { Juguete: Mochila, fondo: 'var(--color-arbol-morado)' },
  { Juguete: Fresa, fondo: 'var(--color-arbol-verde)' },
  { Juguete: Bloque, fondo: 'var(--color-arbol-rojo)' },
] as const
// Fondo de la tarjeta: blanco y, una sí y otra no, un color del árbol muy suave (mezclado con blanco).
const fondosTarjeta = [
  'var(--color-white)',
  'color-mix(in oklab, var(--color-arbol-verde) 45%, white)',
  'var(--color-white)',
  'color-mix(in oklab, var(--color-arbol-azul) 40%, white)',
  'var(--color-white)',
] as const

type CitaProps = {
  texto: string
  autor: string
  indice?: number
  className?: string
  style?: CSSProperties
}

export function Cita({ texto, autor, indice = 0, className = '', style }: CitaProps) {
  const { Juguete, fondo } = avatares[indice % avatares.length]
  return (
    <figure
      className={`relative rounded-[1.75rem] p-6 shadow-[0_0.75rem_1.75rem_rgb(43_40_48/0.12)] ring-1 ring-tinta/5 sm:p-7 ${className}`}
      style={{ background: fondosTarjeta[indice % fondosTarjeta.length], ...style }}
    >
      {/* Comillas grandes de adorno, en la esquina de arriba a la derecha. */}
      <span aria-hidden="true" className="absolute top-3 right-6 font-titulo text-7xl leading-none text-coral/25">
        ”
      </span>
      {/* pr-10: el autor no llega a las comillas de la esquina (en móvil, uno largo las pisaba). */}
      <figcaption className="flex items-center gap-3 pr-10">
        <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full ring-2 ring-white" style={{ background: fondo }}>
          <Juguete className="size-7" />
        </span>
        <span className="flex flex-col">
          <span className="font-titulo text-lg leading-tight font-semibold text-tinta">{autor}</span>
          <span className="text-sm text-tinta/70">{textos.secciones.testimonios.origen}</span>
        </span>
      </figcaption>
      <blockquote className="mt-4 text-lg leading-relaxed text-tinta/90">
        <p>{texto}</p>
      </blockquote>
    </figure>
  )
}
