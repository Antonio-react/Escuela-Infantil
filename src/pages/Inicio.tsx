import { Diferido } from '../components/Diferido'
import { Hero } from '../components/Hero'
import { Cierre } from '../components/secciones/Cierre'
import { FachadaInicio } from '../components/secciones/FachadaInicio'
import { Presentacion } from '../components/secciones/Presentacion'
import { ResumenPaginas } from '../components/secciones/ResumenPaginas'
import { Testimonios } from '../components/secciones/Testimonios'
import { paginas } from '../data/paginas'
import { useMetadatos } from '../hooks/useMetadatos'

export function Inicio() {
  useMetadatos(paginas.inicio)
  return (
    <>
      {/* data-arbol-empieza: el árbol de fondo empieza debajo de este bloque. El hero tiene su propio árbol
          (el logo) y la foto de la fachada separa los dos. */}
      <div data-arbol-empieza>
        <Hero />
        <FachadaInicio />
      </div>
      {/* Lo de más abajo se monta justo después del primer dibujado, cada bloque en su turno (Diferido.tsx):
          la página aparece antes y no se queda bloqueada. */}
      <Diferido altoMinimo="60svh">
        <Presentacion />
      </Diferido>
      <Diferido>
        <ResumenPaginas />
      </Diferido>
      <Diferido>
        <Testimonios />
      </Diferido>
      <Diferido>
        <Cierre />
      </Diferido>
    </>
  )
}
