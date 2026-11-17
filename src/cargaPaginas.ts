import { paginas } from './data/paginas'

// Cada página (menos Inicio, que es por donde entra casi todo el mundo y va con lo principal) se descarga aparte,
// solo cuando hace falta: así quien entra en Inicio no se baja también el código de Contacto, Familias, la 404…
// Estas funciones las usan las rutas (router.tsx) y la precarga al ir a pulsar un enlace (usePrecargaEnlaces.ts):
// import() solo descarga cada archivo una vez, la segunda llamada reutiliza la primera.
export const cargaPaginas = {
  [paginas.laEscuela.ruta]: () => import('./pages/LaEscuela').then((m) => m.LaEscuela),
  [paginas.horarioCalendario.ruta]: () => import('./pages/HorarioCalendario').then((m) => m.HorarioCalendario),
  [paginas.familias.ruta]: () => import('./pages/Familias').then((m) => m.Familias),
  [paginas.contacto.ruta]: () => import('./pages/Contacto').then((m) => m.Contacto),
  [paginas.avisoLegal.ruta]: () => import('./pages/PaginasInteriores').then((m) => m.AvisoLegal),
  [paginas.privacidad.ruta]: () => import('./pages/PaginasInteriores').then((m) => m.Privacidad),
  [paginas.noEncontrada.ruta]: () => import('./pages/NoEncontrada').then((m) => m.NoEncontrada),
}

// ¿Es esta dirección una de las páginas diferidas? "ruta is …" le dice a TypeScript que, si devuelve true, la ruta ya
// se puede usar para buscar en cargaPaginas (sin forzar el tipo).
export function esPaginaDiferida(ruta: string): ruta is keyof typeof cargaPaginas {
  return Object.hasOwn(cargaPaginas, ruta)
}
