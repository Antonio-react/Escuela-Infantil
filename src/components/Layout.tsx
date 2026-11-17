import { Outlet } from 'react-router'
import { textos } from '../data/textos'
import { useMarcaReposo } from '../hooks/useMarcaReposo'
import { usePrecargaEnlaces } from '../hooks/usePrecargaEnlaces'
import { ArbolFondo } from './ArbolFondo'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollArriba } from './ScrollArriba'

// Estructura común a todas las páginas. <Outlet /> es el hueco donde React Router pinta la página actual.
export function Layout() {
  // Marca si la pantalla está quieta: la usan los movimientos "en reposo" (.balancea, en index.css).
  useMarcaReposo()
  // Las páginas se descargan aparte: al ir a pulsar un enlace, se adelanta la descarga de la suya.
  usePrecargaEnlaces()
  return (
    <>
      <a href="#contenido" className="saltar-contenido">
        {textos.saltarContenido}
      </a>
      <Header />
      {/* relative: el árbol de fondo se coloca respecto a este bloque (main + footer). */}
      <div className="relative">
        {/* tabIndex={-1}: permite mover el foco aquí desde "Saltar al contenido" sin meterlo en el orden del tabulador. */}
        {/* relative z-20: el contenido va por delante del árbol de fondo (z-10), que así queda detrás de las
            tarjetas; el footer no lleva z, así que el árbol sí se ve sobre él (las raíces).
            overflow-x-clip: la decoración que asoma por un lado (la nube del móvil de Baby Control...) se recorta en
            el borde de la pantalla y nunca crea scroll lateral. "clip" y no "hidden": hidden rompería los sticky.
            Salvo en Inicio (la página con el hero anclado, [data-zona-hero]), sin el recorte ni la capa (relative z-20):
            con ellos, Safari del iPhone movía el hero anclado a tirones al subir con el scroll (temblaba de arriba a abajo,
            2026-11-17; probado en su iPhone). Allí no hacen falta: lo que asoma (nubes, pájaros, sello) ya lo recorta el
            propio hero (medido: ningún tamaño de 320 a 1024 se sale), y lo de debajo del hero lleva su propia capa por
            delante del árbol de fondo (Inicio.tsx). */}
        <main
          id="contenido"
          tabIndex={-1}
          className="relative z-20 overflow-x-clip [html:has([data-zona-hero])_&]:static [html:has([data-zona-hero])_&]:z-auto [html:has([data-zona-hero])_&]:overflow-x-visible"
        >
          <Outlet />
        </main>
        <Footer />
        <ArbolFondo />
      </div>
      <ScrollArriba />
    </>
  )
}
