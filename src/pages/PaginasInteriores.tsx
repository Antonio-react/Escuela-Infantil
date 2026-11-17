import { PaginaLegal } from '../components/PaginaLegal'
import { avisoLegal, privacidad } from '../data/legal'
import { paginas } from '../data/paginas'

// Páginas legales: las dos usan la misma plantilla (PaginaLegal.tsx) con sus textos de src/data/legal.ts.
// (Las demás páginas interiores tienen su propio archivo: LaEscuela.tsx, HorarioCalendario.tsx, Familias.tsx y
// Contacto.tsx.)

export function AvisoLegal() {
  return <PaginaLegal pagina={paginas.avisoLegal} texto={avisoLegal} />
}

export function Privacidad() {
  return <PaginaLegal pagina={paginas.privacidad} texto={privacidad} />
}
