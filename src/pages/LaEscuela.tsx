import { CabeceraPagina } from '../components/CabeceraPagina'
import { Aulas } from '../components/secciones/Aulas'
import { Cierre } from '../components/secciones/Cierre'
import { Cocina } from '../components/secciones/Cocina'
import { Equipo } from '../components/secciones/Equipo'
import { GaleriaEscuela } from '../components/secciones/GaleriaEscuela'
import { Instalaciones } from '../components/secciones/Instalaciones'
import { cifrasEscuela } from '../data/cifras'
import { fotoCabeceraEscuela } from '../data/fotos'
import { paginas } from '../data/paginas'

// Orden de las secciones: aulas, instalaciones, galería, cocina y equipo, y el cierre (Solicitar visita). La galería
// aparece sola cuando haya fotos (src/data/fotos.ts). Sin proyecto educativo (2026-11-18): no es obligatorio en la web.
export function LaEscuela() {
  return (
    <>
      <CabeceraPagina pagina={paginas.laEscuela} cifras={cifrasEscuela} foto={fotoCabeceraEscuela} />
      <Aulas />
      <Instalaciones />
      <GaleriaEscuela />
      <Cocina />
      <Equipo />
      <Cierre />
    </>
  )
}
