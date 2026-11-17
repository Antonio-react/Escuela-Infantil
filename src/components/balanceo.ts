import type { CSSProperties } from 'react'

// Ajustes del movimiento "en reposo" (.balancea, en index.css): cuánto se mece cada cosa a los lados (px), cuánto
// tarda cada vaivén (s) y cuántos hace. Siempre menos de 5 s en total (WCAG 2.2.2).

// Las nubes del hero: cada una con su distancia, su dirección (negativo = hacia la izquierda) y su ritmo, para que no
// se muevan a la vez como una sola. Un vaivén largo y lento, como a la deriva (12-16 px en casi 5 s).
export function balanceoNube(px: number, segundos: number): CSSProperties {
  return { '--balanceo': `${px}px`, '--duracion-balanceo': `${segundos}s` } as CSSProperties
}

// La nube "Solicitar visita" (barra de escritorio y hero en móvil): muy sutil, 3 px, dos vaivenes de 2,2 s.
export const BALANCEO_BOTON = { '--balanceo': '3px', '--duracion-balanceo': '2.2s', '--vaivenes': '2' } as CSSProperties
