import { CabeceraPagina } from '../components/CabeceraPagina'
import { Actividades } from '../components/secciones/Actividades'
import { Adaptacion } from '../components/secciones/Adaptacion'
import { BabyControl } from '../components/secciones/BabyControl'
import { Cierre } from '../components/secciones/Cierre'
import { Facilidades } from '../components/secciones/Facilidades'
import { PreguntasFrecuentes } from '../components/secciones/PreguntasFrecuentes'
import { paginas } from '../data/paginas'

// Orden de las secciones: lo primero que preocupa (la adaptación), cómo os contamos su día (Baby Control),
// algunas actividades (el corcho), descuentos y pago por empresa, las preguntas frecuentes y el cierre (Solicitar visita).
export function Familias() {
  return (
    <>
      <CabeceraPagina pagina={paginas.familias} />
      <Adaptacion />
      <BabyControl />
      <Actividades />
      <Facilidades />
      <PreguntasFrecuentes />
      <Cierre />
    </>
  )
}
