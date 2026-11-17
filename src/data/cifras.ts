import { site } from './site'

// Cifras grandes del arranque de las páginas interiores (CabeceraPagina): se leen de un vistazo aunque nadie
// lea el párrafo. Todas salen de site.ts: si cambia un dato, cambia la cifra. De momento, solo La escuela
// (si gusta, se añaden las de las demás páginas).
export type Cifra = { valor: string; texto: string }

// "0-1 años" (primera aula) y "2-3 años" (última) → "0-3".
const edadMinima = site.aulas[0].edades.split('-')[0]
const edadMaxima = site.aulas[site.aulas.length - 1].edades.split('-')[1].split(' ')[0]

export const cifrasEscuela: readonly Cifra[] = [
  { valor: String(site.aulas.length), texto: 'aulas por edades' },
  // Rangos con guion largo (–), el correcto en tipografía para "de… a…".
  { valor: `${edadMinima}–${edadMaxima}`, texto: 'años' },
  { valor: `${site.horario.apertura}–${site.horario.cierre}`, texto: 'horario de apertura' },
  // "Comida" y no "Cocina": lo que importa a las familias es lo que comen sus peques. Corto a propósito: la cifra
  // no se parte (whitespace-nowrap) y en móvil van de dos en dos.
  { valor: 'Comida', texto: 'casera, hecha a diario' },
]
