import { CabeceraPagina } from '../components/CabeceraPagina'
import { DondeEstamos } from '../components/secciones/DondeEstamos'
import { FormularioVisita } from '../components/secciones/FormularioVisita'
import { ViasContacto } from '../components/secciones/ViasContacto'
import { enlaceMapa } from '../data/mapa'
import { paginas, partesDescripcionContacto as pd } from '../data/paginas'

// Orden: lo primero, el formulario "Solicitar visita" (el botón de toda la web trae aquí, a su ancla); luego las
// otras formas de hablar con la escuela y dónde está. Sin el cierre de la pizarra: esta página ya es el cierre.
export function Contacto() {
  return (
    <>
      {/* La descripción con cada vía en su color (los de sus iconos en ViasContacto), para distinguirlas en la frase. */}
      <CabeceraPagina
        pagina={paginas.contacto}
        descripcion={
          <>
            {pd.antes} <span className="font-semibold text-coral">{pd.email}</span>,{' '}
            <span className="font-semibold text-arbol-azul-texto">{pd.telefono}</span> o{' '}
            <span className="font-semibold text-verde">{pd.whatsapp}</span>
            {pd.medio}{' '}
            {/* La dirección abre Google Maps (solo un enlace: no carga ningún mapa). En ciruela; el subrayado, solo al pasar el
                ratón (siempre subrayada quedaba excesivo, Antonio). */}
            <a
              href={enlaceMapa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${pd.direccion}, ${pd.direccionAria}`}
              className="font-semibold text-ciruela underline-offset-4 hover:underline"
            >
              {pd.direccion}
            </a>
            .
          </>
        }
      />
      <FormularioVisita />
      <ViasContacto />
      <DondeEstamos />
    </>
  )
}
