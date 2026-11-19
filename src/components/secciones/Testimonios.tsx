import { useInView } from 'motion/react'
import { useRef, type CSSProperties } from 'react'
import { estaEnUnaSeccion } from '../../data/destacados'
import { site } from '../../data/site'
import { testimonios } from '../../data/testimonios'
import { textos } from '../../data/textos'
import { Cita } from '../Cita'
import { IconoGoogle } from '../Iconos'
import { Seccion } from '../Seccion'

// "Lo que dicen las familias" (rediseño, Antonio, 2026-11-16, con referencias de reseñas en tarjetas apiladas):
// - Las tarjetas (Cita.tsx), APILADAS: se montan un poco una sobre otra, algo giradas y desplazadas a un lado y a
//   otro, como reseñas dejadas encima de la mesa.
// - En escritorio, dos columnas: a la izquierda la frase de Google y el botón, que se quedan a la vista al bajar
//   (sticky); a la derecha, la pila. En móvil, la frase y el botón van debajo de la pila.
// - Al verse la sección, las tarjetas caen una tras otra y se colocan (.resenas / .resena en index.css). Con
//   movimiento reducido, ya están en su sitio.
// Solo los testimonios con permiso: true (CLAUDE.md).

// Cómo queda cada tarjeta en la pila: su giro y hacia qué lado se desplaza (se alternan).
const colocacion = [
  { giro: -1.6, lado: 'izquierda' },
  { giro: 1.2, lado: 'derecha' },
  { giro: -0.8, lado: 'izquierda' },
  { giro: 1.6, lado: 'derecha' },
  { giro: -1.1, lado: 'izquierda' },
] as const
const RETRASO_ENTRE_TARJETAS = 140 // ms

export function Testimonios() {
  const t = textos.secciones.testimonios
  // Los que no salen ya en otra sección (destacados.ts): así no se ve el mismo dos veces.
  const visibles = testimonios.filter((testimonio, i) => testimonio.permiso && !estaEnUnaSeccion(i))
  const pila = useRef<HTMLUListElement>(null)
  const visto = useInView(pila, { once: true, amount: 0.15 })
  if (visibles.length === 0) return null
  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'subrayado', color: 'coral' }} colorTitulo="text-ciruela">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        {/* La frase de Google y el botón: en escritorio, a la izquierda y a la vista al bajar; en móvil, debajo. */}
        <div className="order-last flex flex-col items-start gap-5 lg:sticky lg:top-32 lg:order-0 lg:self-start">
          <p className="font-titulo text-2xl leading-snug font-semibold text-tinta sm:text-3xl">{t.resenas}</p>
          <a href={site.redes.googleFicha} target="_blank" rel="noopener noreferrer" aria-label={t.botonAria} className="boton boton-google">
            <IconoGoogle className="size-5" />
            {t.boton}
          </a>
        </div>

        {/* La pila. Cada tarjeta monta un poco sobre la de arriba (-mt-3) y se aparta a un lado (mr/ml). */}
        {/* px-1.5: con el giro, las esquinas de las tarjetas se salen un poco de su sitio; así no tocan el borde. */}
        <ul ref={pila} data-visto={visto} className="resenas flex flex-col px-1.5">
          {visibles.map((testimonio, i) => {
            const { giro, lado } = colocacion[i % colocacion.length]
            const estilo = { '--retraso': `${i * RETRASO_ENTRE_TARJETAS}ms`, rotate: `${giro}deg`, zIndex: i } as CSSProperties
            return (
              <li
                key={testimonio.texto}
                className={`resena relative ${i > 0 ? '-mt-3' : ''} ${lado === 'izquierda' ? 'mr-3 sm:mr-12' : 'ml-3 sm:ml-12'}`}
                style={estilo}
              >
                <Cita texto={testimonio.texto} textoMovil={testimonio.textoMovil} autor={testimonio.autor} indice={i} />
              </li>
            )
          })}
        </ul>
      </div>
    </Seccion>
  )
}
