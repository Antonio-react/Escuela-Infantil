import { textos } from '../../data/textos'
import { tieneValor } from '../../data/todo'
import { Seccion } from '../Seccion'

// "Nuestro proyecto educativo": lo escriben o aprueban las dueñas. Mientras textos.proyectoEducativo sea
// 'TODO', la sección no se pinta (nunca se ve un TODO en la web). Cuando llegue el texto, se ajusta el diseño.
export function ProyectoEducativo() {
  if (!tieneValor(textos.proyectoEducativo)) return null
  return (
    <Seccion titulo={textos.secciones.proyecto.titulo} colorTitulo="text-arbol-naranja-texto">
      <p className="max-w-3xl font-titulo text-2xl leading-snug sm:text-3xl">{textos.proyectoEducativo}</p>
    </Seccion>
  )
}
