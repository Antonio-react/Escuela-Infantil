import type { SVGProps } from 'react'
import { CONTORNO_NUBE, VIEWBOX_NUBE } from './formas'

// Piezas decorativas reutilizables (hero, 404 y, más adelante, los divisores entre secciones).
// Siempre aria-hidden: no aportan información a un lector de pantalla.

// Nube rellena con la forma "original" de las pizarras (bultos también por debajo; antes tenía la base plana).
export function Nube(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEWBOX_NUBE} fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d={CONTORNO_NUBE} />
    </svg>
  )
}

export function Pajaro(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M3 9c5-5 11-5 17 3 6-8 12-8 17-3" />
    </svg>
  )
}
