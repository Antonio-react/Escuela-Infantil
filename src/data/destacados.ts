import { testimonios } from './testimonios'

// Testimonios reales que acompañan a algunas secciones porque hablan justo de eso.
// Se eligen por su posición en testimonios.ts (ese archivo no se toca: los textos van tal cual).
// Si una familia retira el permiso (permiso: false), el testimonio desaparece también de aquí.
const posiciones = {
  adaptacion: 1, // "…Tuvieron mucha paciencia en la adaptación…"
} as const

type Tema = keyof typeof posiciones

export function testimonioDe(tema: Tema) {
  const testimonio = testimonios[posiciones[tema]]
  return testimonio.permiso ? testimonio : null
}
