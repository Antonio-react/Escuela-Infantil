import { CabeceraPagina } from '../components/CabeceraPagina'
import { Aulas } from '../components/secciones/Aulas'
import { Cierre } from '../components/secciones/Cierre'
import { Cocina } from '../components/secciones/Cocina'
import { Equipo } from '../components/secciones/Equipo'
import { GaleriaEscuela } from '../components/secciones/GaleriaEscuela'
import { Instalaciones } from '../components/secciones/Instalaciones'
import { ProyectoEducativo } from '../components/secciones/ProyectoEducativo'
import { cifrasEscuela } from '../data/cifras'
import { fotoCabeceraEscuela } from '../data/fotos'
import { paginas } from '../data/paginas'

// Orden de las secciones: proyecto educativo (cuando las dueñas lo aprueben), aulas, instalaciones, cocina y
// equipo, y el cierre (Solicitar visita). La galería de fotos aparece sola cuando haya fotos (src/data/fotos.ts).
export function LaEscuela() {
  return (
    <>
      <CabeceraPagina pagina={paginas.laEscuela} cifras={cifrasEscuela} foto={fotoCabeceraEscuela} />
      <ProyectoEducativo />
      <Aulas />
      <Instalaciones />
      <GaleriaEscuela />
      <Cocina />
      <Equipo />
      <Cierre />
    </>
  )
}
