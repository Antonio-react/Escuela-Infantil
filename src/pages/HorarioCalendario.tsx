import { CabeceraPagina } from '../components/CabeceraPagina'
import { Calendario } from '../components/secciones/Calendario'
import { Cierre } from '../components/secciones/Cierre'
import { Horario } from '../components/secciones/Horario'
import { paginas } from '../data/paginas'

export function HorarioCalendario() {
  return (
    <>
      <CabeceraPagina pagina={paginas.horarioCalendario} descripcion={false} />
      <Horario />
      <Calendario />
      <Cierre />
    </>
  )
}
