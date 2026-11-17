import { createBrowserRouter } from 'react-router'
import { cargaPaginas } from './cargaPaginas'
import { Layout } from './components/Layout'
import { paginas } from './data/paginas'
import { Inicio } from './pages/Inicio'

// Todas las rutas cuelgan del Layout (header, footer, barra móvil) y salen de src/data/paginas.ts.
// La ruta '*' recoge cualquier dirección que no exista: es la página 404.
// Inicio va con lo principal; el resto, diferidas (lazy): su código se descarga al visitarlas (cargaPaginas.ts).
// Mientras se descarga, se sigue viendo la página de antes (no hay pantalla en blanco).
const diferida = (ruta: keyof typeof cargaPaginas) => ({ path: ruta, lazy: { Component: cargaPaginas[ruta] } })

export const router = createBrowserRouter([
  {
    path: paginas.inicio.ruta,
    element: <Layout />,
    children: [
      { index: true, element: <Inicio /> },
      diferida(paginas.laEscuela.ruta),
      diferida(paginas.horarioCalendario.ruta),
      diferida(paginas.familias.ruta),
      diferida(paginas.contacto.ruta),
      diferida(paginas.avisoLegal.ruta),
      diferida(paginas.privacidad.ruta),
      diferida(paginas.noEncontrada.ruta),
    ],
  },
])
