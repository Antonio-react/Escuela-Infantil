import { testimonios } from './testimonios'

// Testimonios reales que acompañan a algunas secciones porque hablan justo de eso.
// Se eligen por su posición en testimonios.ts (ese archivo no se toca: los textos van tal cual).
// Si una familia retira el permiso (permiso: false), el testimonio desaparece también de aquí.
const posiciones = {
  adaptacion: 1, // "…Tuvieron mucha paciencia en la adaptación…"
} as const

type Tema = keyof typeof posiciones

// ¿Este testimonio ya sale en su sección? Entonces no se repite en Inicio (Antonio, 2026-11-17: en el móvil, tantas
// reseñas seguidas aburren; el de la adaptación se queda solo en Familias).
const reservadas: ReadonlySet<number> = new Set(Object.values(posiciones))
export const estaEnUnaSeccion = (posicion: number) => reservadas.has(posicion)

export function testimonioDe(tema: Tema) {
  const testimonio = testimonios[posiciones[tema]]
  return testimonio.permiso ? testimonio : null
}
